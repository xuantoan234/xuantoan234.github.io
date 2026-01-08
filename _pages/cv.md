---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

<div class="cv-actions">
  <button onclick="window.print()" class="action-btn">
    <i class="fas fa-print"></i> Print CV
  </button>
  <a href="{{ base_path }}/files/CV_XuanToanDang.pdf" class="action-btn" download>
    <i class="fas fa-download"></i> Download PDF
  </a>
</div>

<!-- Print Header (hidden on screen, visible in print) -->
<div class="print-header">
  <div class="print-profile">
    <img src="{{ base_path }}/images/profile.jpeg" alt="Xuan-Toan Dang" class="print-avatar">
    <div class="print-info">
      <h1>Xuan-Toan Dang</h1>
      <p class="print-title">Ph.D. Student in Electronic Engineering</p>
      <p class="print-contact">
        <strong>Email:</strong> dangxuantoan@soongsil.ac.kr<br>
        <strong>Location:</strong> Soongsil University, Seoul, South Korea<br>
        <strong>Google Scholar:</strong> scholar.google.com/citations?user=AlEmGBYAAAAJ
      </p>
    </div>
  </div>
</div>

<!-- Publication Statistics (for print) -->
<div class="print-stats">
  <h3>Publication Summary</h3>
  <div class="stats-row">
    <div class="stat-box"><strong>13</strong> Total Publications</div>
    <div class="stat-box"><strong>10</strong> Journal Articles</div>
    <div class="stat-box"><strong>3</strong> Conference Papers</div>
    <div class="stat-box"><strong>8</strong> Q1 Journals</div>
  </div>
</div>

<div class="cv-nav">
  <a href="#education" class="cv-nav-link">Education</a>
  <a href="#experience" class="cv-nav-link">Experience</a>
  <a href="#skills" class="cv-nav-link">Skills</a>
  <a href="#publications" class="cv-nav-link">Publications</a>
  <a href="#teaching" class="cv-nav-link">Teaching</a>
</div>

<h2 id="education">Education</h2>

- Ph.D in Wireless Communication Lab (WCL), Soongsil University, Seoul, Korea, 2023-Now.
- M.S in Wireless Communication Lab (WCL), Soongsil University, Seoul, Korea, 2021-2023.
- B.S. in Hanoi University of Science and Technology (HUST), Hanoi, Vietnam, 2015-2020.

<h2 id="experience">Work Experience</h2>

**Spring 2018-2020: Research Assistant**

- Research cell-free massive MIMO (CFMM) system at SPARC Lab in HUST, Hanoi, Vietnam.

**Spring 2021-Now: Researcher**

- Research modern wireless communication technologies, including 5G, 6G, cell-free massive MIMO systems, full-duplex communication, physical-layer security (PLS), NOMA, UAV, and applications of machine learning and deep learning in wireless communication systems.

<h2 id="skills">Skills</h2>

- **Wireless Systems:** Expert knowledge of 5G and 6G network architectures, protocols, and advanced challenges.
- **MIMO & Multi-Access:** Specialization in Cell-Free Massive MIMO (CFMM), Full-Duplex (FD), and NOMA.
- **Security & Applications**: Research focused on Physical-Layer Security (PLS) and integration of UAVs.
- **AI/ML for Wireless:** Applied experience utilizing Machine Learning (ML) and Deep Learning (DL) for system optimization.
- **Tools**: Proficient in Python (ML/DL frameworks) and MATLAB (modeling, simulation, and analysis).
- **Research Skills**: Experienced in algorithm development, rigorous simulation-based analysis, and technical paper writing.

<h2 id="publications">Publications</h2>
  <ul>{% for post in site.publications reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
  
Talks
======
  <ul>{% for post in site.talks reversed %}
    {% include archive-single-talk-cv.html  %}
  {% endfor %}</ul>
  
<h2 id="teaching">Teaching</h2>
  <ul>{% for post in site.teaching reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
  
