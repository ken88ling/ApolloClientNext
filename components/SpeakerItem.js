import React from "react";
import { GET_SPEAKERS } from "../graphql/queries";
import { useMutation, useReactiveVar } from "@apollo/client";
import { DELETE_SPEAKER, TOGGLE_SPEAKER_FAVORITE } from "../graphql/mutations";
import { checkBoxListVar, paginationDataVar } from "../graphql/apolloClient";

function SpeakerItem({ speakerRec }) {
  const { id, first, last, favorite, fullName, checkBoxColumn } = speakerRec;
  const [toggleSpeakerFavorite] = useMutation(TOGGLE_SPEAKER_FAVORITE);
  const [deleteSpeaker] = useMutation(DELETE_SPEAKER);
  const selectedSpeakerIds = useReactiveVar(checkBoxListVar);
  const paginationData = useReactiveVar(paginationDataVar);

  return (
    <div
      key={id}
      className="m-1"
      style={favorite === true ? { border: "1px solid red" } : {}}
    >
      <h4>
        <input
          type="checkbox"
          defaultChecked={checkBoxColumn}
          onClick={() => {
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
          className="m-2"
        />
        {fullName} ({id})
      </h4>
      <div>
        <div>
          <button
            className="btn btn-primary m-2"
            onClick={() => {
              toggleSpeakerFavorite({
                variables: {
                  speakerId: parseInt(id),
                },
                // refetchQueries: [{ query: GET_SPEAKERS }],
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
        </div>
      </div>

      <span
        onClick={() => {
          deleteSpeaker({
            variables: {
              speakerId: parseInt(id),
            },
            optimisticResponse: {
              typename: "__mutation",
              deleteSpeaker: {
                id,
                first,
                last,
                favorite,
              },
            },
            // refetchQueries: [{ query: GET_SPEAKERS }],
            update: (cache, { data: { deleteSpeaker } }) => {
              const { speakers } = cache.readQuery({
                query: GET_SPEAKERS,
                variables: {
                  limit: paginationData.limit,
                  offset: paginationData.offset,
                },
              });
              cache.writeQuery({
                query: GET_SPEAKERS,
                variables: {
                  limit: paginationData.limit,
                  offset: paginationData.offset,
                },
                data: {
                  speakers: {
                    __typename: "SpeakerResults",
                    datalist: speakers.datalist.filter(
                      (rec) => rec.id !== deleteSpeaker.id
                    ),
                    pageInfo: {
                      __typename: "PageInfo",
                      totalItemCount: 0,
                    },
                  },
                },
              });
            },
          }).then();
        }}
      >
        <button className="btn btn-primary m-2">Delete</button>
      </span>
      <hr />
    </div>
  );
}

export default SpeakerItem;
