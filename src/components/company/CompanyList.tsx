"use client";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { motionContainer, motionItem } from "~/utils/animation";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import SecondaryButton from "~/components/button/SecondaryButton";
import CompanyCardSkeleton from "../skeleton/CompanyCardSkeleton";
import CompanyCard from "./CompanyCard";

type Company = RouterOutputs["company"]["getAll"][0];

const CompanyList = () => {
  const [companies, setCompanies] = useState<Company[]>();
  const [hasMore, setHasMore] = useState<boolean>();

  const getCompanies = api.company.infiniteCompanies.useMutation({
    cacheTime: 60 * 60 * 1000,
  });

  const fetchCompanies = async () => {
    const skip = companies?.length || 0;
    const newData = await getCompanies.mutateAsync({
      skip: skip,
    });
    const uniqueCompanies = removeDuplicates([
      ...(companies || []),
      ...(newData?.companies || []),
    ]);
    setCompanies(uniqueCompanies);
    setHasMore(newData.hasMore);
  };

  function removeDuplicates(companies: Company[]) {
    const companiesSet = new Set();
    return companies.filter((company) => {
      if (companiesSet.has(company.id)) {
        return false;
      } else {
        companiesSet.add(company.id);
        return true;
      }
    });
  }

  useEffect(() => {
    fetchCompanies();
  }, []);

  const skeleton = [...Array(9).keys()].map((i) => {
    return <CompanyCardSkeleton key={i} />;
  });

  return (
    <>
      {companies ? (
        <motion.ul
          variants={motionContainer}
          initial="hidden"
          animate="visible"
          className=" grid h-fit w-full  gap-6 md:grid-cols-[repeat(auto-fit,clamp(150px,30vw,175px))]"
        >
          {companies?.map((company) => {
            return <CompanyCard key={company.id} company={company} />;
          })}
          {hasMore && (
            <motion.li
              variants={motionItem}
              className="group relative grid grid-cols-[1fr_auto] rounded-2xl bg-white p-4   shadow-2xl shadow-accent-100/50 hover:shadow-accent-200  hover:ring-2 hover:ring-accent-200  md:grid-cols-1"
            >
              <SecondaryButton
                onClick={() => fetchCompanies()}
                loading={getCompanies.isLoading}
                disable={getCompanies.isLoading}
              >
                Load More
              </SecondaryButton>
            </motion.li>
          )}
        </motion.ul>
      ) : (
        <>
          <ul className=" grid h-fit  gap-6 md:grid-cols-[repeat(auto-fit,clamp(150px,30vw,175px))]">
            {skeleton}
          </ul>
        </>
      )}
    </>
  );
};

export default api.withTRPC(CompanyList);
