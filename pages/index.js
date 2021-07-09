import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import Toolbar from "../components/Toolbar";

const GET_SPEAKERS = gql`
  query {
    speakers {
      datalist {
        id
        first
        last
        favorite
      }
    }
  }
`;

const TOGGLE_SPEAKER_FAVORITE = gql`
  mutation ToggleSpeakerFavorite($speakerId: Int!) {
    toggleSpeakerFavorite(speakerId: $speakerId) {
      id
      first
      last
      favorite
    }
  }
`;

const DELETE_SPEAKER = gql`
  mutation DeleteSpeaker($speakerId: Int!) {
    deleteSpeaker(speakerId: $speakerId) {
      id
      first
      last
      favorite
    }
  }
`;

const ADD_SPEAKER = gql`
  mutation AddSpeaker($first: String!, $last: String!, $favorite: Boolean) {
    addSpeaker(speaker: { first: $first, last: $last, favorite: $favorite }) {
      id
      first
      last
      favorite
    }
  }
`;

export default function Index(props) {
  const { loading, error, data } = useQuery(GET_SPEAKERS);
  const [toggleSpeakerFavorite] = useMutation(TOGGLE_SPEAKER_FAVORITE);
  const [deleteSpeaker] = useMutation(DELETE_SPEAKER);
  const [addSpeaker] = useMutation(ADD_SPEAKER);

  if (loading) return <div className="col-sm6">Loading...</div>;
  if (error) return <div className="col-sm6">Error</div>;

  return (
    <>
     <div style={{margin:'12px'}}>
       <h4>Create New Speaker</h4>
       <Toolbar
           insertSpeakerEvent={(first, last, favorite) => {
             addSpeaker({
               variables: {
                 first,
                 last,
                 favorite,
               },
               refetchQueries: [{ query: GET_SPEAKERS }],
             }).then();
           }}
       />
     </div>
      <hr/>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            {data.speakers.datalist.map(({ id, first, last, favorite }) => {
              return (
                <div key={id}>
                  <h4>
                    {first} {last} ({id})
                  </h4>
                  <div>
                    <div>
                      <button
                        onClick={() => {
                          toggleSpeakerFavorite({
                            variables: {
                              speakerId: parseInt(id),
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
                        refetchQueries: [{ query: GET_SPEAKERS }],
                      }).then();
                    }}
                  >
                    Delete
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
