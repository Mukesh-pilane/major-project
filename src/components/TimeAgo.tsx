"use client";
import React from "react";
import TimeAgo from "react-timeago";

const TimeAgoComponent = ({ createdAt }: { createdAt: Date }) => {
  return <TimeAgo date={createdAt} />;
};

export default TimeAgoComponent;
