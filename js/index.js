function select(s){return document.querySelector(s)}
var gh, repo, ls = {get:function(k){return JSON.parse(localStorage.getItem(k))},set:function(k,v){localStorage.setItem(k,JSON.stringify(v))},del:function(k){localStorage.removeItem(k)}}





function sign(){
  select("#unsigned").style.display       = "block";
  select("#signed").style.display         = "none";
  select("#blog-container").style.display = "block";
  var pword = ls.get("password"),
      uname = ls.get("username"),
      urepo = ls.get("repo");

  gh    = new Github({username: uname, password: pword, auth: "basic"}),
  repo  = gh.getRepo(uname, urepo)
  select("#account").innerHTML = "@"+uname
  select("#expanding").className = "col-md-6"
  select("#contracting").style.display = "block"
  showBlogs()
}

function unsign(){
  ls.set("username", null)
  ls.set("password", null)
  ls.set("repo",     null)
  select("#expanding").className = "col-md-12"
  select("#contracting").style.display    = "none"
  select("#account").innerHTML            = null
  select("#signed").style.display         = "block";
  select("#unsigned").style.display       = "none"
  select("#blog-container").style.display = "none";
  gh   = null
  repo = null
}





function newBlog(title, text) {return "<div class='col-md-3'><span class='blog-id'>"+title+"</span><div class='blog-text'>"+text+"</span></div>"}

function appendBlog(title, text) {
  var blogs = select("#blogs")
  blogs.innerHTML = blogs.innerHTML + newBlog(title, text)
}

function showBlogs(){
  // This is failing. IDK why.
  repo.contents("gh-pages", "markdown/", function(err, contents) {
    console.dir(err, contents)
    // for (var i=0;i<contents.length;i++) {
    //   var blogs = select("#blogs"),
    //       blog  = contents[i]

    //   appendBlog(blog.name, blog.content)
    // }
  });
}





select("#sign-in").addEventListener("click", function(){
  var uname = select("#username"),
      pword = select("#password"),
      urepo = select("#repo")


  ls.set("username", uname.value)
  ls.set("password", pword.value)
  ls.set("repo",     urepo.value)


  alert("Welcome, "+uname.value+"!")

  uname.value = null
  pword.value = null
  urepo.value = null

  sign()
})

select("#sign-out").addEventListener("click", function(){
  alert("See ya later, "+ls.get("username")+"!")
  unsign()
})

select("#send").addEventListener("click", function(){
  var title = select("#title"),
      blog  = select("#blog")

  if (!gh && !repo) return alert("Need to sign in first!")

  // Need to auto increment instead of title

  repo.write("gh-pages", "markdown/"+title.value+".md", blog.value, title.value+" post.", function(err) {
    console.log(err)
  });

  appendBlog(title.value, blog.value)
  alert("Thanks for blogging!")
  title.value = null
  blog.value  = null
})





// Init





if (ls.get("username") && ls.get("password") && ls.get("repo")) {
  sign()
} else {
  unsign()
}
