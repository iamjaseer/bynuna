"use client";

import { useEffect, useRef, useState } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/20/solid"; // Import icons from Heroicons
import {
  apiUrl,
  getTranslation,
  homeUrl,
  linkSlug,
  siteName,
} from "../Utils/variables";
import ViewMoreLess from "./ViewMoreLess";
import { useSiteContext } from "../Context/siteContext";
import { useRouter } from "next/navigation";
import { useLanguageContext } from "../Context/LanguageContext";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";

const Accordion = ({
  items,
  navigation,
  filter,
  filterGraphic,
  filterLink,
  filterComponent,
  general,
  noHtml,
  haveUrl,
}) => {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;

  const { translation } = useLanguageContext();

  const [openIndex, setOpenIndex] = useState(null);
  const {
    showMegaMenu,
    queryUpdated,
    setQueryUpdated,
    setShowMegaMenu,
    selectedFilters,
    setSelectedFilters,
  } = useSiteContext();

  //CHECK EXTENCTIONS
  function hasExtension(str) {
    const regex = /\.[a-zA-Z0-9]+$/;
    return regex.test(str);
  }

  //==========SELETED FILTERS=============

  const [isUpdating, setIsUpdating] = useState(false);
  // Use a ref to handle the updating state without triggering rerenders
  const isUpdatingRef = useRef(false);

  // Function to update the URL with selected filters

  const updateURL = (filters) => {
    const currentQuery = new URLSearchParams(window.location.search);

    // Remove previous filters
    currentQuery.delete("filter_items");

    // Format filters into the desired structure
    const filterString = filters.join("&filter_items="); // Join multiple filters with '|'

    // Append the new filter as a single _filter_items key
    currentQuery.append("filter_items", filterString);

    // Push the updated URL to the router
    router.push(
      `${window.location.pathname}?${currentQuery.toString()}`,
      undefined,
      { shallow: true }
    );
  };

  // Function to handle adding/removing filters
  const activeFilters = (item) => {
    setSelectedFilters((prevFilters) => {
      // Check if the item is already in the filters array
      const isItemSelected = prevFilters.includes(item);

      // Update the filter list based on whether the item is selected
      const updatedFilters = isItemSelected
        ? prevFilters.filter((filter) => filter !== item) // Remove if already selected
        : [...prevFilters, item]; // Add if not selected

      // Avoid setting state during render, use ref to delay URL update
      if (!isUpdatingRef.current) {
        isUpdatingRef.current = true; // Mark the update as in progress

        setTimeout(() => {
          updateURL(updatedFilters);
          isUpdatingRef.current = false; // Reset the flag after the update
        }, 300); // Wait for 300ms before updating the URL
      }

      return updatedFilters;
    });
  };

  //FILTER END

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);

    // Scroll to the element with class 'more-info' when an accordion item is clicked
    const moreInfoElement = document.querySelector(".more-info");
    if (moreInfoElement) {
      moreInfoElement.scrollIntoView({
        behavior: "smooth",
        block: "start", // Scrolls to the top of the element
      });
    }
  };

  const AccordionItem = ({
    title,
    mainCat,
    children,
    isOpen,
    onClick,
    haveUrl,
  }) => (
    <div className={`${!navigation ? `border-b rounded-none` : ""}`}>
      {navigation ? (
        <div className="flex items-center justify-between">
          {!haveUrl ? (
            <Link
            onClick={(e) => {
              setShowMegaMenu(false),
                (document.body.style.overflow = "auto");
            }}
              href={`${homeUrl}${locale}/products/${
                mainCat && mainCat?.toLowerCase()?.replace(/ /g, "-")
              }/${title && title?.toLowerCase()?.replace(/ /g, "-")}/`}
              className="w-full uppercase primary-font text-primary  text-left font-medium transition-all rounded-t-lg flex items-center justify-between"
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: getTranslation(
                    translation[0]?.translations,
                    title,
                    locale || "en"
                  ),
                }}
              />
            </Link>
          ) : (
            <h4 className="w-full uppercase primary-font text-primary  text-left font-medium transition-all rounded-t-lg flex items-center justify-between">
              <span
                dangerouslySetInnerHTML={{
                  __html: getTranslation(
                    translation[0]?.translations,
                    title,
                    locale || "en"
                  ),
                }}
              />
            </h4>
          )}
          <div onClick={onClick} className={`${navigation && "lg:hidden"}`}>
            {isOpen ? (
              <PlusIcon className="h-5 w-5 text-primary" />
            ) : (
              <MinusIcon className="h-5 w-5 text-primary" />
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={onClick}
          className={`w-full text-left ${
            general ? "px-0 py-5" : "px-0 p-4"
          }  font-semibold transition-all rounded-t-lg flex items-center justify-between`}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: getTranslation(
                translation[0]?.translations,
                title,
                locale || "en"
              ),
            }}
            className={`${
              general || filter
                ? `primary-font sm:text-[14px] text-sm ${
                    filter && "uppercase !text-xs"
                  }`
                : ""
            }`}
          />

          <div className={`${navigation && "sm:hidden"}`}>
            {isOpen ? (
              <MinusIcon className="h-5 w-5 text-primary" />
            ) : (
              <PlusIcon className="h-5 w-5 text-primary" />
            )}
          </div>
        </button>
      )}

      {/* NORMAL */}
      {!navigation && !filter && isOpen && (
        <div className="pb-7 rounded-b-lg general-content">{children}</div>
      )}

      {/* NAVIGATION */}
      {navigation && !isOpen && (
        <div className=" grid gap-4 mt-3 rounded-none">
          {children.map((item, index) => (
            <ViewMoreLess
              footerNavigation
              key={index}
              items={[item]}
              maxLength={10}
            />
          ))}
        </div>
      )}

      {/* FILTER */}
      {filter &&
        !filterGraphic &&
        !filterLink &&
        !filterComponent &&
        isOpen && (
          <div className="rounded-b-lg grid sm:gap-2 gap-3 pb-5 max-h-[200px] overflow-auto">
            {children &&
              Array.from(new Set(children.map((item) => item?.text)))
                .map((text) => children.find((item) => item?.text === text))
                ?.map((item, index) => (
                  <div
                    key={item?.id || `${item?.text}-${index}`}
                    className="flex gap-3 items-center"
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-success checkbox-xs rounded-none"
                      onChange={() =>
                        activeFilters(item?.text?.val_label?.split("|")[0])
                      } // Pass the full item to the handler
                      checked={selectedFilters.includes(
                        item?.text?.val_label?.split("|")[0]
                      )}
                    />

                    <label
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html:
                          locale === "en"
                            ? item?.text?.val_label.split("~:")[1].split("|")[0]
                            : item?.text?.val_label.split("|")[1]
                            ? item?.text?.val_label.split("|")[1]
                            : item?.text?.val_label
                                .split("~:")[1]
                                .split("|")[0],
                      }}
                    />
                  </div>
                ))}
          </div>
        )}

      {/* FILTER GRAPHIC */}
      {filter && filterGraphic && !filterLink && !filterComponent && isOpen && (
        <div className="rounded-b-lg grid grid-cols-8 items-center gap-3 pb-5">
          {children?.map((item, index) => {
            const itemKey = item?.item || `${index}`;

            const searchString = item?.text?.split("|")[0]?.toLowerCase();

            const isSelected = selectedFilters.some(
              (item) => item.trim() === searchString.trim()
            );

            const backgroundStyle = hasExtension(item?.text.split("|")[0])
              ? {
                  background: `url(${apiUrl}wp-content/uploads/${
                    item?.text.split("|")[0].split(":")[1]
                  }) no-repeat center`,
                }
              : {
                  background: item?.text
                    .split("|")[0]
                    .split(":")[1]
                    ?.toLowerCase(),
                };

            return (
              <div key={itemKey}>
                <div
                  className={`select-graphic rounded-full tooltip tooltip-primary tooltip-xs !bg-contain `}
                  data-tip={item?.item}
                  style={{
                    ...backgroundStyle,
                  }}
                >
                  <input
                    type="checkbox"
                    className="absolute z-10 top-[5px] right-[5px] size-4 rounded-full opacity-0"
                    onChange={() =>
                      activeFilters(item?.text?.split("|")[0]?.toLowerCase())
                    }
                    checked={isSelected}
                  />
                  {isSelected ? (
                    <div className="bg-primary text-white rounded-full absolute inset-[4px] flex items-center justify-center">
                      <i className="bi bi-check text-xs"></i>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FILTER LINK */}

      {filter && filterLink && !filterComponent && isOpen && (
        <div className="rounded-b-lg grid  gap-3 pb-5 max-h-[200px] overflow-auto">
          {children.map((item, index) => (
            <Link
              key={index}
              href={`${homeUrl}${locale}/products/${params?.category}/${item?.link}`}
              className="text-sm block transition-all hover:text-primary"
            >
              {item?.text}
            </Link>
          ))}
        </div>
      )}

      {/* FILTER COMPONENT */}
      {filter && filterComponent && isOpen && (
        <div className="rounded-b-lg grid  gap-3 pb-5">
          {getTranslation(
            translation[0]?.translations,
            children,
            locale || "en"
          )}
          {children}
        </div>
      )}
    </div>
  );

  if (general) {
    return (
      <div className="w-full mx-auto">
        {items &&
          items
            ?.filter((item) => item !== null)
            .map((item, index) =>
              item?.content !== null ? (
                <AccordionItem
                  key={index}
                  title={item?.title?.rendered || item?.title}
                  isOpen={openIndex === index}
                  onClick={(event) => {
                    toggleAccordion(index);
                  }}
                >
                  {noHtml ? (
                    item?.content
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item?.content?.rendered || item?.content,
                      }}
                    />
                  )}
                </AccordionItem>
              ) : null
            )}
      </div>
    );
  } else {
    return (
      <div className="w-full mx-auto">
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            title={item.title}
            mainCat={item.mainCat}
            isOpen={openIndex === index}
            onClick={() => toggleAccordion(index)}
            haveUrl={item?.haveUrl}
          >
            {item.content}
          </AccordionItem>
        ))}
      </div>
    );
  }
};

export default Accordion;
