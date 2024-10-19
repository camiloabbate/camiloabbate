---
title: "Web Scrapping with R"
author: "Camilo Abbate"
date: 2020-12-01T21:13:14-05:00
categories: ["R"]
tags: ["RSelenium", "Web Scrapping", "dynamic websites"]
---



# Example of a script that scrapes a website

In this example, we will scrape the [Office of the Comptroller General from Paraguay](https://portaldjbr.contraloria.gov.py/portaldjbr/), that hosts thousands of financial statements of government employees. You'll need:

- [Mozilla Firefox](https://www.mozilla.org/en-US/firefox/new/)
- [Java](https://www.java.com/en/download/manual.jsp)


# Setup

First, clear the environment and load necessary libraries:


``` r
rm(list = ls()) 

library(pacman)
pacman::p_load("RSelenium", "tidyverse", "tidylog", "netstat", "wdman","polite")
```


Let's use the 2 presidents of Paraguay as examples:


``` r
names_to_search <- c("Mario Abdo Benítez", "Horacio Cartes")
```





