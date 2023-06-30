// pages/about.js
import React from "react";
import NavBar from "../components/NavBar";

export default function About() {
  return (
    <div>
      <NavBar />
      <h1>About</h1>
      <p>
        Our application, the **Reaction Game**, is an innovative brain
        reaction-time tool developed to aid in the early detection of
        Alzheimer&apos;s disease. Using visual stimuli and advanced analytics,
        we offer a novel approach to identifying subtle cognitive changes that
        may suggest Alzheimer&apos;s onset. The user interface is simple and
        intuitive. To start, users input basic demographic information. Then,
        they engage in a set of quick visual reaction tests, aiming to click a
        red circle as rapidly as possible. The application records the response
        times and repeats the process for ten rounds. The results are then
        plotted on a user-friendly scatter plot that compares an
        individual&apos;s performance to a database of scores. Technically, the
        Reaction Game is an exemplar of modern web-based applications. Built
        with Next.js and React, it offers a seamless, fast, and user-friendly
        experience. The visualization is crafted with D3.js, providing a dynamic
        and interactive data display. The data is stored and fetched from a
        real-time database, Firebase, ensuring data security and integrity. The
        cutting-edge aspect of our application lies in its potential for early
        Alzheimer&apos;s detection. Alzheimer&apos;s often begins with subtle
        changes in cognitive abilities, which our application is designed to
        track. By monitoring and analyzing these changes over time, the Reaction
        Game may provide an early warning signal for Alzheimer&apos;s disease,
        enabling earlier intervention and treatment. Thank you for using the
        Reaction Game. Together, we can better understand Alzheimer&apos;s disease
        and advance its early detection.
      </p>
    </div>
  );
}
