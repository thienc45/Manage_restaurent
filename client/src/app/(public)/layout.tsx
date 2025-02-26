import React from "react";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="bg-authen hidden bg-cover bg-center lg:block lg:w-1/2"></div>

      <div className="flex w-full items-center justify-center px-4 max-lg:min-h-screen lg:w-1/2">
        <div className=" mx-auto w-full max-w-md lg:max-w-lg">
          <div className="mt-3 w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
