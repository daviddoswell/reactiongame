// pages/about.js
import React from "react";
import NavBar from "../components/NavBar";

export default function About() {
  return (
    <div>
      <NavBar />
      <h1>About</h1>
      <p className="about-text">
        Brain Game is an innovative reaction-time tool developed by NeuroAge to
        aid in the early detection of Alzheimer&apos;s disease. Using visual
        stimuli and advanced analytics, we offer a novel approach to identifying
        subtle cognitive changes that may suggest Alzheimer&apos;s onset.
      </p>

      <br></br>

      <p className="about-text">
        The user interface is simple and intuitive. To start, users input basic
        demographic information: name and age. Next, they engage in a set of
        quick visual reaction tests where they aim to click a red circle as
        rapidly as possible. The software records the response times and repeats
        the process for 10 rounds. The results are then plotted on a
        user-friendly scatter plot that compares an individual&apos;s recent
        performance to a database of scores.
      </p>

      <br></br>

      <p className="about-text">
        Brain Game belongs to a suite of applications designed for their
        potential to detect early-stage Alzheimer&apos;s disease throughout
        one&apos;s life. Alzheimer&apos;s often begins with subtle changes in
        cognitive abilities, which our applications are designed to track. By
        monitoring and analyzing these changes over time, Brain Game
        provides an early warning signal for Alzheimer&apos;s disease in a
        distribution of patients, enabling earlier intervention and treatment.
        Thank you for participating in Brain Game. Together, we can better understand Alzheimer&apos;s disease
        and advance its early detection.
      </p>
    </div>
  );
}
