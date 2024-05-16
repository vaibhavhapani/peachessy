import { cn } from "@/lib/utils";
import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface loadingProps {}

const loading: FC<loadingProps> = ({}) => {
  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-1rem)]">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
              <Skeleton />
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">
                <Skeleton />
              </span>
            </div>
            <span className="text-sm text-gray-600">
              <Skeleton />
            </span>
          </div>
        </div>
      </div>
      <div
        id="messages"
        className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        <div>
          <div className="chat-message">
            <div className={cn("flex items-end")}>
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-xs mx-2"
                )}
              >
                <span
                  className={cn("px-4 py-1 mt-1 rounded-lg inline-block", {})}
                >
                  <Skeleton />
                  <span className="ml-2 text-xs text-gray-400">
                    <Skeleton />
                  </span>
                </span>
              </div>
              <div className={cn("relative w-6 h-6 ", {})}>
                <Skeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <div className="relative flex overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
          <Skeleton className="block w-full resize-none" />
          <Skeleton></Skeleton>
        </div>
      </div>
    </div>
  );
};

export default loading;
