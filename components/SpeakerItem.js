import React from "react";
import { GET_SPEAKERS } from "../graphql/queries";
import { useMutation, useReactiveVar } from "@apollo/client";
import { DELETE_SPEAKER, TOGGLE_SPEAKER_FAVORITE } from "../graphql/mutations";
import { checkBoxListVar } from "../graphql/apolloClient";

function SpeakerItem({ speakerRec }) {
  const { id, first, last, favorite, fullName, checkBoxColumn } = speakerRec;
  const [toggleSpeakerFavorite] = useMutation(TOGGLE_SPEAKER_FAVORITE);
  const [deleteSpeaker] = useMutation(DELETE_SPEAKER);
  const selectedSpeakerIds = useReactiveVar(checkBoxListVar);

  return (
    <div key={id}>
      <h4>

        <input
          type="checkbox"
          onClick={() => {
              console.log('check trigger');
            checkBoxListVar(
              checkBoxColumn === true
                ? selectedSpeakerIds.filter((rec) => {
                    return rec !== id;
                  })
                : selectedSpeakerIds
                ? [...selectedSpeakerIds, id]
                : [id]
            );
          }}
          checked={checkBoxColumn}
          className="m-2"
        />
        {fullName} ({id})
      </h4>
      <div>
        <div>
          <button
            onClick={() => {
              toggleSpeakerFavorite({
                variables: {
                  speakerId: parseInt(id),
                },
                optimisticResponse: {
                  __typename: "Mutation",
                  toggleSpeakerFavorite: {
                    id,
                    first,
                    last,
                    favorite: !favorite,
                    __typename: "Speaker",
                  },
                },
              }).then();
            }}
          >
            Favorite
          </button>
          -> {favorite === true ? "True" : "false"}
        </div>
      </div>

      <span
        onClick={() => {
          deleteSpeaker({
            variables: {
              speakerId: parseInt(id),
            },
            // refetchQueries: [{ query: GET_SPEAKERS }],
            update: (cache, { data: { deleteSpeaker } }) => {
              const { speakers } = cache.readQuery({
                query: GET_SPEAKERS,
              });
              cache.writeQuery({
                query: GET_SPEAKERS,
                data: {
                  speakers: {
                    __typename: "SpeakerResults",
                    datalist: speakers.datalist.filter(
                      (rec) => rec.id !== deleteSpeaker.id
                    ),
                  },
                },
              });
            },
          }).then();
        }}
      >
        <div style={{ margin: "5px" }}>
          <button>Delete</button>
        </div>
      </span>
      <hr />
    </div>
  );
}

export default SpeakerItem;
