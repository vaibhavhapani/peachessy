"use client";
import { FC, useState } from "react";
import Button from "./Button";
import { addFriendValidator } from "@/lib/validations/add-friend";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

interface AddFriendButtonProps {}

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    try {
      const validateEmail = addFriendValidator.parse({ email });

      await axios.post("/api/friends/add", {
        email: validateEmail,
      });

      setShowSuccessState(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("email", { message: error.message });
        return;
      }

      if (error instanceof AxiosError) {
        setError("email", { message: error.response?.data });
      } else {
        setError("email", { message: "Something went wrong!" });
      }
    }
  };

  const onSubmit = (data: FormData) => {
    addFriend(data.email);
  };
  return (
    <>
      <form className="max-w-sm" onSubmit={handleSubmit(onSubmit)}>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Invite friend by E-mail
        </label>
        <div className="mt-2 flex gap-4">
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="you@example.com"
            {...register("email")}
          ></input>
          <Button>Add</Button>
        </div>
        <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
        {showSuccessState ? (
          <p className="mt-1 text-sm text-indigo-600">Friend Request sent</p>
        ) : null}
      </form>
    </>
  );
};

export default AddFriendButton;
