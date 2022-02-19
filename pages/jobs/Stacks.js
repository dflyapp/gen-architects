import { useState } from 'react'
import styles from './Slug.module.css'

export default function Stacks() {
  const [hide, setHide] = useState(true)

  return (
    <>
      <section className={`${styles.stacks} ${hide ? 'is-hide' : 'is-show'}`}>
        <h5 className="mt-4">Active Tech Stack & Tools</h5>
        <p>This is a list of technology currently used in our teams:</p>

        <p className="mt-4">
          <strong>Backend:</strong> .NET core • .NET MVC • Entity Framework •
          Web API • NHibernate • IdentityServer4 • Hangfire • Node JS • Firebase
          • Swagger • Restful APIs • JPA • JAX-RS.
        </p>
        <p>
          <strong>Frontend:</strong> JavaScript • React JS • Typescript • Jquery
          • HTML5 • SASS/LESS • Bootstrap • Styled Components • Custom UX
          frameworks • React Router • React Redux.
        </p>
        <p>
          <strong>DB • Data & Search:</strong> MSSQL • Oracle • Flyway •
          Postgres • SQLite • SOLR • Elastic Search • Cassandra • Kafka • Redis
          • Spark • Hadoop • Neo4J.
        </p>
        <p>
          <strong>Native mobile development:</strong> Java • Kotlin •
          Objective-C • Swift • Android SDK • iOS SDK.
        </p>
        <p>
          <strong>Architecture:</strong> MVC • MVVM/Reactive • MVP • Clean
          Architecture • Microservice • Enterprise architectures.
        </p>
        <p>
          <strong>Automated tests / Quality:</strong> Cypress • Selenium •
          native mobile e2e tests (XCUITest • Espresso) • Protractor • Jasmine •
          NUnit • JUnit • SonarQube • Postman.
        </p>
        <p>
          <strong>Monitoring:</strong> Kilbana • Datadog • Sentry • Stacktify •
          SqlMonitor.
        </p>
        <p>
          <strong>Server:</strong> Rancher • Docker • Kubernetes • IIS • JBOSS.
        </p>
        <p>
          <strong>DevOps:</strong> Jenkins • Octopus • CircleCI • GitHub
          Enterprise • Bitbucket enterprise • Maven • Gradle • Grunt • Gulp •
          Webpack • npm • nuget • cocoapod.
        </p>
        <p>
          <strong>Data Tools: </strong> GA • GTM • Cross-engage • Informizely •
          Intercom • Sitespect • Split.io • PolyBase • Sql Server Analysis •
          Qlik • Power BI • Google BigQuery • Tensorflow • Pytorch • SparkML •
          Squooba.
        </p>
        <p>
          <strong>IDEs & Editors:</strong> IntelliJ • MS Visual Studio. Android
          Studio • XCode • Webstorm • Microsoft Visual Studio Code • Resharper.
        </p>
        <p>
          <strong>Testing infrastructure and Mobile devices:</strong> One dev
          per dev • testing device pool • also Microsoft Azure Mobile Test
          Service.
        </p>
        <p>
          <strong>UX & Analysis:</strong> Figma • Sketch • Zeplin • Whimsical •
          Google Analytics • GTM • Google DataStudio • Hotjar • Informizely •
          SiteSpect • Firebase • Streamline-icons • Refactoring UI.
        </p>
        <p>
          <strong>Collaboration and Communication tools:</strong> Jira •
          Confluence • Slack • Zoom • Miro.
        </p>
        <p>
          <strong>Hardware:</strong> iMac • Macbook Pro • Powerful PCs and
          Laptops with screens (2550 x 1440 screen).
        </p>
      </section>
      <div className={styles.divider}>
        <button className={styles.button} onClick={() => setHide(!hide)}>
          <span className="mr-2">{hide ? 'Show' : 'Hide'}</span>
          {hide ? (
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.59 0.0899963L6 4.67L1.41 0.0899963L0 1.5L6 7.5L12 1.5L10.59 0.0899963Z"
                fill="white"
              />
            </svg>
          ) : (
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.41 7.41004L6 2.83003L10.59 7.41003L12 6.00003L6 3.48568e-05L-1.23266e-07 6.00004L1.41 7.41004Z"
                fill="white"
              />
            </svg>
          )}
        </button>
      </div>
    </>
  )
}
