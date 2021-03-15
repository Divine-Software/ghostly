import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'Print formatting/PDF generator',
    imageUrl: 'img/statistics-3679874.svg',
    description: (
      <>
        Ghostly is perfect for generating invoces, rich sales reports or any other
        kind of printable documents. Being powered by a modern web browser, its
        layout capabilities are second to none.
      </>
    ),
  },
  {
    title: 'Generate beautiful emails',
    imageUrl: 'img/at-sign-1083508.svg',
    description: (
      <>
        Each template can produce several output formats, such as plain text, HTML,
        PDF, or even PNG and JPEG images. Additionally, a template may generate any number
        of secondary results, such as email attachments or CSV/spreadsheet documents.
      </>
    ),
  },
  {
    title: 'Fully programmable templates',
    imageUrl: 'img/cpu-2103856.svg',
    description: (
      <>
        Ghostly templates are powered by HTML, CSS and JavaScript/TypeScript.
        Roll your own template engine, or use Handlebars, Angular, React, Stencil ...
        Ghostly templates can contain complex logic and even query remote databases or
        web services during rendering.
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p className="text--justify">{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`${siteConfig.title}`}
      description={`${siteConfig.tagline}`}>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container text--center">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
