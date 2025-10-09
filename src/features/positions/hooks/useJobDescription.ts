import { useState, useRef } from "react";

const initialJobDescription = `About the UI Designer position
<br/>We are looking for an experienced UI Designer to create amazing user experiences, helping our products to be highly attractive and competitive.
<br/>You should be keen in clean and artful design and be able to translate high-level requirements into interaction flows and artifacts, creating beautiful, intuitive, and functional user interfaces.
<br/>UI Designer responsibilities are:
<br/>• Work together with product management and engineering to build innovative solutions for the product direction, visuals and experience
<br/>• Participate in all visual design stages from concept to final hand-off to engineering
<br/>• Develop original ideas that bring simplicity and user friendliness to complex design roadblocks
<br/>• Prepare wireframes, storyboards, user flows, process flows and site maps to effectively communicate interaction and design ideas
<br/>• Discuss designs and key milestone deliverables with peers and executive level stakeholders
<br/>• Perform user research and evaluate user feedback
<br/>• Set design guidelines, best practices and standards
<br/>• Stay up-to-date with the latest UI trends, techniques, and technologies
<br/>UI Designer requirements are:
<br/>• 2+ years' experience of working on a UI Designer position
<br/>• Profound UI design skills with a solid portfolio of design projects
<br/>• Significant experience in creating wireframes, storyboards, user flows, process flows and site maps
<br/>• Significant experience with Photoshop, Illustrator, OmniGraffle, or other visual design and wire-framing tools
<br/>• Good practical experience with HTML, CSS, and JavaScript for rapid prototyping
<br/>• Strong visual design skills with good understanding of user-system interaction
<br/>• Strong presentational and team player abilities
<br/>• Strong problem-solving skills with creative approach
<br/>• Experience of working in an Agile/Scrum development process
<br/>• BS or MS degree in Human-Computer Interaction, Interaction Design, or other related area`;

export function useJobDescription() {
  const [jobDescription, setJobDescription] = useState(initialJobDescription);
  const [showAlignmentOptions, setShowAlignmentOptions] = useState(false);
  const jobDescriptionRef = useRef<HTMLDivElement>(null);

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
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const commonAncestor = range.commonAncestorContainer;

      let isAlreadyList = false;
      let listItem: HTMLElement | null = null;

      let currentElement: HTMLElement | null =
        commonAncestor.nodeType === Node.ELEMENT_NODE
          ? (commonAncestor as HTMLElement)
          : commonAncestor.parentElement;

      while (
        currentElement &&
        jobDescriptionRef.current.contains(currentElement)
      ) {
        if (currentElement.tagName === "LI") {
          listItem = currentElement;
          isAlreadyList = true;
          break;
        }
        currentElement = currentElement.parentElement;
      }

      if (isAlreadyList && listItem) {
        const textContent = listItem.innerHTML.replace(/^- /, "");
        const newParagraph = document.createElement("p");
        newParagraph.innerHTML = textContent;
        listItem.replaceWith(newParagraph);
      } else {
        document.execCommand("insertHTML", false, "<li>- </li>");
      }
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

  return {
    jobDescription,
    setJobDescription,
    showAlignmentOptions,
    setShowAlignmentOptions,
    jobDescriptionRef,
    handleFormat,
    handleAlignment,
    handleList,
    handleLink,
  };
}
