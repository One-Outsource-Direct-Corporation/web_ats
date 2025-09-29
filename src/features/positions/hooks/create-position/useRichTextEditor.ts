import { useState, useRef } from "react";

export const useRichTextEditor = () => {
  const jobDescriptionRef = useRef<HTMLDivElement | null>(null);
  const [jobDescription, setJobDescription] =
    useState(`About the UI Designer position
<br/>We are looking for an experienced UI Designer to create amazing user experiences, helping our products to be highly attractive and competitive.
<br/>You should be keen in clean and artful design and be able to translate high-level requirements into interaction flows and artifacts, creating beautiful, intuitive, and functional user interfaces.`);
  const [showAlignmentOptions, setShowAlignmentOptions] = useState(false);

  const handleFormat = (command: string, value?: string) => {
    if (jobDescriptionRef.current) {
      jobDescriptionRef.current.focus();
      document.execCommand(command, false, value);
      setJobDescription(jobDescriptionRef.current.innerHTML);
    }
  };

  const handleAlignment = (alignment: "Left" | "Center" | "Right") => {
    if (jobDescriptionRef.current) {
      jobDescriptionRef.current.focus();
      document.execCommand(`justify${alignment}`, false, undefined);
      setJobDescription(jobDescriptionRef.current.innerHTML);
      setShowAlignmentOptions(false);
    }
  };

  const handleList = () => {
    if (jobDescriptionRef.current) {
      jobDescriptionRef.current.focus();
      document.execCommand("insertHTML", false, "<li>- </li>");
      setJobDescription(jobDescriptionRef.current.innerHTML);
    }
  };

  const handleLink = () => {
    if (jobDescriptionRef.current) {
      const url = prompt("Enter the URL:");
      if (url) {
        document.execCommand("createLink", false, url);
        setJobDescription(jobDescriptionRef.current.innerHTML);
      }
    }
  };

  const resetJobDescription = () => {
    setJobDescription(`About the UI Designer position
<br/>We are looking for an experienced UI Designer to create amazing user experiences, helping our products to be highly attractive and competitive.
<br/>You should be keen in clean and artful design and be able to translate high-level requirements into interaction flows and artifacts, creating beautiful, intuitive, and functional user interfaces.`);
  };

  return {
    jobDescriptionRef,
    jobDescription,
    setJobDescription,
    showAlignmentOptions,
    setShowAlignmentOptions,
    handleFormat,
    handleAlignment,
    handleList,
    handleLink,
    resetJobDescription,
  };
};
