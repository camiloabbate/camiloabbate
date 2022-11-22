#I'm just following 

# https://www.apreshill.com/blog/2020-12-new-year-new-blogdown/

#step by step:

# if (!requireNamespace("remotes")) install.packages("remotes")
# remotes::install_github("rstudio/blogdown")

library(blogdown)
new_site(theme = "wowchemy/starter-academic")


#After this last line: You should now see something like this. ??IMAGE?? 
# Take a moment to read through these messages - importantly, 
#it tells you how to start and stop the server so you can preview your site. 
# Importantly, when you come back to your project, note that you can use blogdown::serve_site() or
# the “Serve Site” addin to preview it locally.

blogdown::serve_site()
# if error:  blogdown::install_hugo("0.106.0")

blogdown::new_post(title = "Hi Hugo",ext = '.Rmarkdown',subdir = "post")

# if exists, opens; if not, creates new
blogdown::config_Rprofile()



# Use the console to author a new .Rmarkdown post; I’ll name my post “Hi Hugo”:

blogdown::new_post(title = "Hi Hugo", 
                   ext = '.Rmarkdown', 
                   subdir = "post")

blogdown::new_post(title = "Another", 
                   ext = '.Rmarkdown', 
                   subdir = "post")


blogdown::new_post(title = "Last One", 
                   ext = '.Rmarkdown', 
                   subdir = "post")


file.edit(".gitignore")


blogdown::check_gitignore()

#make sure to completely erase the lock file that it's located in
# the git folder.. it's hard cuz sometimes it's hidden!!
#use github desktop to commit as well, just in case

# Whether you change your Netlify site name or use the random one,
#go back to your configuration file and cchange the baseurl there to
#match where Netlify is publishing your site:


rstudioapi::navigateToFile("config/_default/config.yaml", line = 3)



blogdown::config_netlify()


blogdown::check_netlify()


# Now, we’ll leave blogdown and R Markdown behind. We’ll just be using Hugo and Wowchemy (I think it is said like alchemy? Why??) to build your personal website.

# Let’s start by running another blogdown check to check_hugo():

blogdown::check_hugo()


# Let’s start with the last thing you typically do to your home- decorate. 
# Open up the file config/_default/params.toml. 
# Play with any of these configurations, but especially fonts/themes

rstudioapi::navigateToFile("config/_default/params.yaml")



# If you want deeper customization of the styling, you can create a new CSS file assets/scss/custom.scss and use it to override any existing styles. 
# heavily borrowing from my former intern Desirée De Leon!



#For now, let's start editing the "ABOUT" page:
# Find and open the file content/authors/admin/_index.md:

rstudioapi::navigateToFile("content/authors/admin/_index.md")

#let's create a post with the image we want for the header:
blogdown::new_post(title = "aberte", 
                   ext = '.Rmarkdown', 
                   subdir = "post")













