"use client";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";

type resetFormInput = {
  password: string;
  newPassword: string;
};

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<resetFormInput>();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetObj, setResetObj] = useState({
    id: "",
    client: "",
  });

  const password = watch("password");

  const onSubmit: SubmitHandler<resetFormInput> = (data) => {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/reset-password/${resetObj.id}/${resetObj.client}`;
    setIsLoading(true);
    axios.post(endpoint, {
        newPassword: data.newPassword
    })
    .then((response)=>{
        toast.success(response.data.message);
    })
    .catch((error) => {
        toast.error(error.response.data.message || "an error occcured");
    })
    .finally(() => {
        setIsLoading(false);
    });
  };

  useEffect(() => {
    const storedResetObj = sessionStorage.getItem("resetObj");
    if (storedResetObj) {
        const obj =  JSON.parse(storedResetObj)
        setResetObj({
            ...resetObj,
            id: obj.id,
            client: obj.role,
        });
    }
  }, []);

  return (
    <main className="flex flex-col  min-h-screen px-4 md:px-6 lg:px-8 xl:px-10 max-w-screen-2xl mx-auto">
      <Toaster />
      <Link href="/">
        <Image
          src="/logo.png"
          alt="AO and CO Logo"
          width={125}
          height={50}
        />
      </Link>
      <div className="flex-1 flex justify-center items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[90%] md:w-1/2 lg:w-1/3"
        >
          <p className="text-xl font-semibold text-[#485d3a] text-center mb-2">
            Reset Password
          </p>
          <p className="text-center font-light mb-4 md:mb-6">Enter your password</p>
          <div className="space-y-3">
            <div className="flex flex-col gap-3">
              <label htmlFor="password">New Password</label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                  })}
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`px-2 py-2 md:py-3 block rounded-md border ${
                    errors.password ? "border-red-500" : "border-black"
                  } w-full`}
                />
                <EyeOff
                  onClick={() => setShowPassword(!showPassword)}
                  className={`${
                    !showPassword
                      ? "absolute top-[50%] right-2 -translate-y-[50%] cursor-pointer"
                      : "hidden"
                  }`}
                />
                <Eye
                  onClick={() => setShowPassword(!showPassword)}
                  className={`${
                    !showPassword
                      ? "hidden"
                      : "cursor-pointer absolute top-[50%] right-2 -translate-y-[50%]"
                  }`}
                />
              </div>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mb-2">
                {errors.password.message}
              </p>
            )}
            <div className="flex flex-col gap-3">
              <label htmlFor="password">Confirm Password</label>
              <div className="relative">
              <input
                {...register("newPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className={`px-2 py-2 md:py-3 block rounded-md border ${
                  errors.newPassword ? "border-red-500" : "border-black"
                } w-full`}
                type={showConfirmPassword ? "text" : "password"}
                name="newPassword"
                id="newPassword"
                placeholder="Confirm your password"
              />
              <EyeOff
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`${
                  !showConfirmPassword
                    ? "absolute top-[50%] right-2 -translate-y-[50%] cursor-pointer"
                    : "hidden"
                }`}
              />
              <Eye
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`${
                  !showConfirmPassword
                    ? "hidden"
                    : "absolute top-[50%] right-2 -translate-y-[50%] cursor-pointer"
                }`}
              />
              </div>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mb-2">
                {errors.newPassword.message}
              </p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className={`py-3 w-full rounded-md text-white font-medium transition-all duration-300 transform ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed opacity-70"
                  : "bg-[#485d3a] hover:bg-[#3a4a2e] hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
              }`}
            >
              {isLoading ? "Loading..." : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
