"use client";

import Link from "next/link";
import styles from "../../styles/AboutPage.module.scss"

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
  <h1>About Flowvent</h1>
  
  <p>
    Flowvent is a modern event booking platform designed to simplify how users discover, 
    and book event tickets. It is built with a focus on <strong>scalability, security, 
    and maintainability</strong>, leveraging cloud technologies and best practices.
  </p>

  <h2>Our Mission</h2>
  <p>
    We aim to create a seamless experience for event-goers and soon UI for organizers. 
    Users can browse events, reserve seats, and receive instant booking request confirmation, 
    while event organizers gain insights into bookings and monitor audience participation.</p>

  <h2>Tech Stack & Skills Showcased</h2>
  <ul>
    <li>Frontend: React, Next.js, TypeScript, SCSS</li>
    <li>Backend: .NET 8, C#, Azure Functions</li>
    <li>Database & Cloud: Azure Cosmos DB, SQL, Azure Service Bus</li>
    <li>CI/CD & DevOps: GitHub, Azure DevOps</li>
    <li>Security: JWT Authentication, best practices for cloud security</li>
    <li>AI Integration: Intelligent event assistant powered by Azure OpenAI for personalized recommendations</li>
  </ul>

  <h2>Meet the Flowvent AI Agent</h2>
  <p>
    Flowvent features an AI-powered event assistant that helps you find the perfect events 
    based on your preferences. Ask it about locations, dates, ticket prices, or even 
    family-friendly activities, and it will provide helpful guidance while our platform 
    displays the event cards for easy booking.
  </p>
  <p>
    For example, you can ask: <em>&quot;What events are happening in Gothenburg next month?&quot;</em> 
    or <em>&quot;Show me the most affordable workshops.&quot;</em> The AI agent will guide you and 
    highlight the best matches instantly.
  </p>

  <h2>Why Flowvent?</h2>
  <p>
  This platform showcases my skills as a <strong>Microsoft Certified Azure Developer (AZ-204)</strong>, demonstrating serverless cloud services, full-stack development, and practical use of Azure solutions.
  </p>

  <p>
    Learn more about our <Link href="/events">upcoming events</Link> and start booking today! 
    Chat with our AI agent to find the events that suit you best.
  </p>
</div>

  );
}
