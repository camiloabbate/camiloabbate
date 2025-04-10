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
pacman::p_load("RSelenium", "tidyverse", "tidylog", "netstat",
               "wdman","polite","rvest")
```


# First, let's ask politely if we can scrappe the site:


``` r

bow("https://portaldjbr.contraloria.gov.py/portaldjbr/")
## <polite session> https://portaldjbr.contraloria.gov.py/portaldjbr/
##     User-agent: polite R package
##     robots.txt: 1 rules are defined for 1 bots
##    Crawl delay: 5 sec
##   The path is scrapable for this user-agent
```
Let's use 2 presidents of Paraguay as examples:


``` r
names_to_search <- c("Mario Abdo Benítez", "Horacio Cartes")
```



# Start an RSelenium server and browser session:


``` r
rD <- RSelenium::rsDriver(
  port = free_port(),
  browser = c("firefox"),
  version = "latest",
  chromever = NULL
)

remDr <- rD[["client"]]
# # In case you get an error on the port, trial closing the browser like this:
# remDr$close()

# or like this:
# system("taskkill /im java.exe /f", intern=FALSE, ignore.stdout=FALSE)
```

# Navigate to the website


``` r
initial_address <- "https://portaldjbr.contraloria.gov.py/portaldjbr/"
remDr$navigate(initial_address)
```


Hopefully everything went smoothly until this step. Now we are almost ready to start downloading the financial statements. Let's do a loop to search for the names of the presidents in the search box and download all their statements:


``` r

for (i in 1:length(names_to_search)){
  
  remDr$navigate(initial_address)
  
  search_bar_location <- ".col-5 > input:nth-child(1)"
  
  actual_search_bar <- remDr$findElement(using = "css selector",
                                         search_bar_location)
  
  Sys.sleep(2)
  
  actual_search_bar$sendKeysToElement(list(names_to_search[i]))
  
  Sys.sleep(3)
  
  remDr$findElement(using = "css selector", ".icon")$clickElement()

  # Load the table:
  Sys.sleep(4)
  
  # first, let's see how many files there are:
  # Check the number of rows of the table:
  table <- remDr$findElement(using = 'css selector', value = 'table')
  
  table_html <- table$getElementAttribute('outerHTML')[[1]]
  # Parse the HTML to extract the table data
  table_data <- read_html(table_html) %>% html_table()
  # Convert the data frame to a tibble
  table_tibble <- table_data[[1]] %>% as_tibble()
  
  # Now, let's download the files:
  
  for (j in 1:nrow(table_tibble)){
    
    # Click on the PDF file
    remDr$findElement(using = 'css selector', 
                      value = paste0("div.row:nth-child(4) > div:nth-child(1) > div:nth-child(1) >
                                     div:nth-child(2) > table:nth-child(1) > tbody:nth-child(2) >
                                     tr:nth-child(",j,") > td:nth-child(5) > div:nth-child(1) >
                                     div:nth-child(1) > button:nth-child(1)"))$clickElement()
    # Wait for the download to finish:
    Sys.sleep(5)
    
  }
  
  
}
  
```

And voilá, you should see the downloaded pdfs in your download folder.
