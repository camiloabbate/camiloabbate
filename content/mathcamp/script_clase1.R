


rm(list = ls())

library(pacman)


p_load(tidyverse,tidylog,janitor,readxl) # readr is in tidyverse


carnero <- read_csv("other_stuff/carneiro_2021.csv")



rideshare <- read_csv("other_stuff/rideshare_kaggle.csv")

colnames(rideshare)

str(rideshare)

#dictionary <- read_excel("other_stuff/dictionary.xlsx")

colnames(rideshare)

rideshare %>% group_by(hour) %>% count() %>% arrange(desc(n)) %>% print(., n = 24)


# damn whatever, this is not important. What we want is to learn how to do functions and how to work with matrices...


# ok, matrices in R:

?matrix()

# so we need to know how to do vectors in R:

# vector:

v1 <- c(1,2,3)

matrix(v1,nrow = 1, ncol = 3)

matrix(v1,nrow = 3, ncol = 1)

matrix(v1,nrow = 3, ncol = 3)

# notice that it says byrow: interesting:

u <- c(1:9)

mat <- matrix(u, nrow = 3, byrow = T)

mat

# say we want to mat[1,1]

mat[1,2]

mat[3,3]

# ok cool, let's calculate the trace of the matrix

dim(mat)

size <- 3

trace <- 0

for (i in 1:size){
  
  trace <- trace + mat[i,i]
  
}

mat


# Nice, but what if I want to generalize this for any matrix?

trace_calculator <- function(the_matrix){
  
  if( ncol(the_matrix) != nrow(the_matrix) ) {
    
    print("Trace not defined, the matrix must be square")
    
    
  } else {
  
  size <- ncol(the_matrix)
  
  trace <- 0
  
  for (i in 1:size){
    
    trace <- trace + the_matrix[i,i]
    
    
  }
  
  return(trace)
  
  }
  
}


trace_calculator(mat)

u <- matrix(v1)

trace_calculator(u)


alter_trace_calculator <- function(the_matrix){
  
  if( ncol(the_matrix) != nrow(the_matrix) ) {
    
    print("Trace not defined, the matrix must be square")
    
    
  } else {
    
    size <- ncol(the_matrix)
    
    trace <- 0
    
    i = 1
    
    while (i <= size) {
      
    trace <- trace + the_matrix[i,i]
    
    i = i + 1  
      
    }
    
    return(trace)
    
  }
  
}


alter_trace_calculator(mat)

# DOOOOPE






# This doesn't make sense!

?det()

# Function to check singularity and solve system
solve_system <- function(A, b) {
  if (det(A) == 0) {
    cat("It does not have a unique solution\n")
  } else {
    solution <- solve(A, b)
    return(solution)
  }
}



solve_system(mat,c(4,8,1))



# Lucas numbers and Fibonacci numbers:

# Should we try to find a beta hat "manually"? Let's see:




beta_hat <- function(y, data_set) {
  
  # where y is going to be data_set$y
  # where x is going to be all the other columns of data_set except y
  
  x <- data_set[, -which(names(data_set) == "y")]
  
  # Calculate the beta hat using the formula
  
  
}







