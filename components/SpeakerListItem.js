import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { GET_SPEAKERS } from "../graphql/queries";
import { ADD_SPEAKER } from "../graphql/mutations";
import Toolbar from "./Toolbar";
import React from "react";
import SpeakerItem from "./SpeakerItem";

export default function SpeakerListItem(props) {
  const { loading, error, data } = useQuery(GET_SPEAKERS);
  const [addSpeaker] = useMutation(ADD_SPEAKER);
  const apolloClient = useApolloClient();

  if (loading) return <div className="col-sm6">Loading...</div>;
  if (error) return <div className="col-sm6">Error</div>;

  return (
    <>
      <div style={{ margin: "12px" }}>
        <h4>Create New Speaker</h4>
        <Toolbar
          sortByIdDescending={() => {
            const { speakers } = apolloClient.cache.readQuery({
              query: GET_SPEAKERS,
            });
            apolloClient.cache.writeQuery({
              query: GET_SPEAKERS,
              data: {
                speakers: {
                  __typename: "SpeakerResults",
                  datalist: [...speakers.datalist].sort((a, b) => b.id - a.id),
                },
              },
            });
          }}
          insertSpeakerEvent={(first, last, favorite) => {
            addSpeaker({
              variables: {
                first,
                last,
                favorite,
              },
              // refetchQueries: [{ query: GET_SPEAKERS }],
              // todo let's update the cache instead re-fetch data from server again
              update: (cache, { data: { addSpeaker } }) => {
                const { speakers } = cache.readQuery({
                  query: GET_SPEAKERS,
                });
                cache.writeQuery({
                  query: GET_SPEAKERS,
                  data: {
                    speakers: {
                      __typename: "SpeakerResults",
                      datalist: [addSpeaker, ...speakers.datalist],
                    },
                  },
                });
              },
            });
          }}
        />
      </div>
      <hr />
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            {data.speakers.datalist.map(({ id, first, last, favorite }) => {
              return (
                <SpeakerItem
                  key={id}
                  speakerRec={{ id, first, last, favorite }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
