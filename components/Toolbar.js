import React from "react";
import { useForm } from "react-hook-form";
import { GET_SPEAKERS } from "../graphql/queries";
import { useApolloClient, useMutation } from "@apollo/client";
import { ADD_SPEAKER } from "../graphql/mutations";

export default function Toolbar() {
  const { register, handleSubmit } = useForm();
  const [addSpeaker] = useMutation(ADD_SPEAKER);
  const apolloClient = useApolloClient();

  const onSubmit = (d) => {
    insertSpeakerEvent(d.first, d.last, d.favorite);
  };

  const sortByIdDescending = () => {
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
  };

  const insertSpeakerEvent = (first, last, favorite) => {
    addSpeaker({
      variables: {
        first,
        last,
        favorite,
      },
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
  };

  return (
    <>
      <h4>Create New Speaker</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <label>First Name</label>
        <input {...register("first")} />
        <label>Last Name</label>
        <input {...register("last")} />
        <div>
          Is Favorite <input type="checkbox" {...register("favorite")} />
        </div>
        <input type="submit" value="submit" />
      </form>
      <hr />
      <button onClick={sortByIdDescending}>
        <span>Sort Speakers by id descending</span>
      </button>
    </>
  );
}
