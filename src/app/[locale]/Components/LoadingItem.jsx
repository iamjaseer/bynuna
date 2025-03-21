"use client";

import { getTranslation, siteName } from "../Utils/variables";
import { useLanguageContext } from "../Context/LanguageContext";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";


export default function LoadingItem({
  dot,
  spinner,
  classes,
  fullscreen,
  message,
  order
}) {

  const { translation } = useLanguageContext();


  const params = useParams();  
  const locale = params.locale; 




  return (
    <>


{order && (
        <div className=" bg-white  fixed inset-0 z-[999] flex items-center justify-center">
          <div className="text-center grid gap-5 items-center justify-center">
            <span
              className={`${classes ? classes : ''} loading loading-spinner text-primary mx-auto`}></span>
           <h3 className="text-lg">Please wait while your order is being processed...</h3>
          </div>
        </div>
      )}


      {dot && (
        <span className={`${classes} loading loading-dots text-primary`}></span>
      )}

      {spinner && (
        <span
          className={`${classes} loading loading-spinner text-primary`}
        ></span>
      )}

      {fullscreen && (
        <div className="bg-white fixed inset-0 z-[999] flex items-center justify-center opacity-90">
          <div className="text-center grid gap-5 items-center justify-center">
            <span
              className={`${classes} loading loading-spinner text-primary mx-auto`}
            ></span>
            {message && (
              <p>
                {getTranslation(
                  translation[0]?.translations,
                  message,
                  locale || 'en'
                )}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
