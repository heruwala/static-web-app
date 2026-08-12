
import React from 'react';
import './App.css';

function App() {
  const launchWindow = 'Q1 2027';

  return (
    <main className="site-shell" aria-label="Under construction page">
      <div className="background-grid" aria-hidden="true" />
      <div className="background-beam beam-a" aria-hidden="true" />
      <div className="background-beam beam-b" aria-hidden="true" />

      <section className="hero-card">
        <p className="status-pill">Live Build Feed</p>
        <h1>
          We are building{' '}
          <span>something uncommon.</span>
        </h1>
        <p className="hero-copy">
          This site is currently under construction. The structure is stable, the design system is being hand-crafted,
          and the final launch window is {launchWindow}.
        </p>

        <div className="progress-panel" role="status" aria-live="polite">
          <div className="progress-labels">
            <span>Structural Work</span>
            <span>78%</span>
          </div>
          <div className="progress-track" aria-hidden="true">
            <div className="progress-fill" />
          </div>
        </div>

        <div className="milestones" aria-label="Build milestones">
          <article>
            <h2>Visual Identity</h2>
            <p>Complete</p>
          </article>
          <article>
            <h2>Core Experience</h2>
            <p>In Progress</p>
          </article>
          <article>
            <h2>Public Launch</h2>
            <p>{launchWindow}</p>
          </article>
        </div>
      </section>

      <aside className="signal-tower" aria-label="Build telemetry">
        <div className="tower-top" />
        <div className="tower-pulse" />
        <p>Broadcasting updates from the construction deck.</p>
      </aside>
    </main>
  );
}

export default App;
