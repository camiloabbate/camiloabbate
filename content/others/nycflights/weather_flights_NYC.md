---
title: "Weather conditions and NYC Flights"
output: html_document
date: "2025-08-29"
---



# Generating a scatter plot of wind speed and departure delay

In this document, we are working with weather data from airports in NYC and flights departing from here.
Before we start, we need to clean the environment and load the packages we are going to use:


``` r
library(pacman)

p_load(tidyverse,tidylog,nycflights13)
```

```
## Installing package into 'C:/Users/camel/AppData/Local/R/win-library/4.5'
## (as 'lib' is unspecified)
```

```
## Warning: unable to access index for repository http://www.stats.ox.ac.uk/pub/RWin/bin/windows/contrib/4.5:
##   cannot open URL 'http://www.stats.ox.ac.uk/pub/RWin/bin/windows/contrib/4.5/PACKAGES'
```

```
## package 'nycflights13' successfully unpacked and MD5 sums checked
## 
## The downloaded binary packages are in
## 	C:\Users\camel\AppData\Local\Temp\RtmpWoxhP8\downloaded_packages
```

```
## 
## nycflights13 installed
```

```
## Warning: package 'nycflights13' was built under R version 4.5.2
```

## Join datasets

Now that we have the packages up and running, let's do a join between the dataframes weather and flights.
Careful, it might not be trivial to do the join, let's see


``` r
flights_with_weather <- flights %>% left_join(weather)
```

```
## Joining with `by = join_by(year, month, day, origin, hour, time_hour)`
## left_join: added 9 columns (temp, dewp, humid, wind_dir, wind_speed, …)
## > rows only in x 1,556
## > rows only in weather ( 6,737)
## > matched rows 335,220
## > =========
## > rows total 336,776
```

As tidylog informs us, we are losing 1556 observations. That's fine for the purpose of this exercise.
Let's overwrite the \textbf{flights\_with_weather} dataframe to only give us the exact matches:


``` r
flights_with_weather <- flights %>% inner_join(weather)
```

```
## Joining with `by = join_by(year, month, day, origin, hour, time_hour)`
## inner_join: added 9 columns (temp, dewp, humid, wind_dir, wind_speed, …)
## > rows only in x ( 1,556)
## > rows only in weather ( 6,737)
## > matched rows 335,220
## > =========
## > rows total 335,220
```

### Now we are equipped to do the ggplot scatterplot

Given that we have a dataframe with the two desired columns, ggpplot() + geom$\_$point() + geom$\_$smooth() should give us what we want. Let's just select a random sample of 10k flights:



``` r
flights_with_weather %>% sample_n(10000) %>% ggplot() + 
  geom_point(aes(x = wind_speed, y = dep_delay))
```

```
## sample_n: removed 325,220 rows (97%), 10,000 rows remaining
```

```
## Warning: Removed 275 rows containing missing values or values outside the scale range
## (`geom_point()`).
```

<img src="/others/nycflights/weather_flights_NYC_files/figure-html/unnamed-chunk-4-1.png" width="672" />



# Adding a regression line:


``` r
flights_with_weather %>% sample_n(10000) %>% ggplot() + 
  geom_point(aes(x = wind_speed, y = dep_delay)) + 
  geom_smooth(aes(x = wind_speed, y = dep_delay), method = "lm", color = "red")
```

```
## sample_n: removed 325,220 rows (97%), 10,000 rows remaining
## `geom_smooth()` using formula = 'y ~ x'
```

```
## Warning: Removed 267 rows containing non-finite outside the scale range
## (`stat_smooth()`).
```

```
## Warning: Removed 267 rows containing missing values or values outside the scale range
## (`geom_point()`).
```

<img src="/others/nycflights/weather_flights_NYC_files/figure-html/unnamed-chunk-5-1.png" width="672" />










