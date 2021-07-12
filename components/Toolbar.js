import React from "react";
import { useForm } from "react-hook-form";

export default function Toolbar({ insertSpeakerEvent, sortByIdDescending }) {
  const { register, handleSubmit } = useForm();
  const onSubmit = (d) => {
    insertSpeakerEvent(d.first, d.last, d.favorite);
  };



  return (
    <>
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
