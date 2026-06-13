---
widget: blank
headless: true
active: true
weight: 13

title: Publications
subtitle: ''

design:
  columns: '1'
---

<style>
  .hp-paper { margin-bottom: 1.4rem; }
  .hp-paper-title { font-size: 1rem; font-weight: 600; color: #2a6496; margin-bottom: 0.1rem; }
  .hp-paper-title a { color: #2a6496; text-decoration: none; }
  .hp-paper-title a:hover { text-decoration: underline; }
  .hp-paper-meta { font-size: 0.9rem; color: #444; margin-bottom: 0.3rem; }
  .hp-paper-buttons { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.3rem; }
  .hp-btn {
    font-size: 0.78rem; padding: 2px 10px;
    border: 1px solid #aaa; border-radius: 3px;
    background: #fff; color: #333;
    text-decoration: none; display: inline-block;
  }
  .hp-btn:hover { background: #f0f0f0; }
  .hp-abstract-box {
    display: none; margin-top: 0.5rem; padding: 0.7rem 1rem;
    background: #f9f9f9; border-left: 3px solid #2a6496;
    font-size: 0.88rem; color: #333; line-height: 1.6;
  }
</style>

<script>
function hpToggle(id) {
  var el = document.getElementById(id);
  el.style.display = (el.style.display === 'block') ? 'none' : 'block';
}
</script>

<div class="hp-paper">
  <div class="hp-paper-title"><a href="/research/var_hfa/">Video Assistant Referee and Home Field Advantage: Implications for Referee Bias</a></div>
  <div class="hp-paper-meta">with Jeffrey Cross and Richard Uhrig &nbsp;|&nbsp; <a href="https://doi.org/10.1002/soej.12731" target="_blank">Southern Economic Journal</a> | 2024</div>
  <div class="hp-paper-buttons">
    <button class="hp-btn" onclick="hpToggle('hp-abs-hfa')">abstract</button>
    <a class="hp-btn" href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4295203" target="_blank">PDF</a>
    <a class="hp-btn" href="https://doi.org/10.1002/soej.12731" target="_blank">DOI</a>
    <a class="hp-btn" href="/replication-gate.html">Replication Files (Secure)</a>
  </div>
  <div class="hp-abstract-box" id="hp-abs-hfa">
    Previous research has highlighted referee bias as a potential contributor to home field advantage in soccer. We exploit the staggered implementation of Video Assistant Referee (VAR) using data from the top domestic league in 16 countries between 2009 and 2019 to estimate the effect of objective review systems on home field advantage. Surprisingly, VAR had negligible effects on home field advantage and various crucial match statistics despite decreased total offsides and yellow cards. These results provide suggestive evidence regarding the mechanisms through which referee bias might contribute to home field advantage and highlight how scope may limit the effectiveness of review processes in general.
  </div>
</div>

<div class="hp-paper">
  <div class="hp-paper-title"><a href="/research/split_ticket/">Toward an Interpretation of Split-Ticket Voting in Paraguay</a></div>
  <div class="hp-paper-meta">with Diego Abente Brun and Raushan Zhandayeva &nbsp;|&nbsp; <a href="#" target="_blank">Revista Uruguaya de Ciencia Política</a> | 2025</div>
  <div class="hp-paper-buttons">
    <button class="hp-btn" onclick="hpToggle('hp-abs-split')">abstract</button>
    <a class="hp-btn" href="https://revistasfcs.edu.uy/index.php/rucp/en/article/view/285/406" target="_blank">PDF</a>
  </div>
  <div class="hp-abstract-box" id="hp-abs-split">
    The academic literature on split ticket voting in Latin America reveals a notable gap: the case of Paraguay. This country represents an outlier since, unlike patterns observed in other countries with hegemonic parties, split ticket voting in Paraguay occurs in the opposite direction: the presidential candidate of the ruling party consistently outperforms the candidates on the national list of their own party. This article conducts a statistical analysis of the 2013 and 2018 general elections using disaggregated data at the level of the 258 electoral districts.
  </div>
</div>
