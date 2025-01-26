"use client";

import { format, isValid } from "date-fns";

import { constants } from "@/lib";

export const renderDate = (
  dateString: string | null | undefined,
  dateFormat: string = constants.l.dt.displayDateFormat,
) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isValid(date) ? format(date, dateFormat) : dateString;
};
