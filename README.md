# SumUp documentation site

Generates documentation about SumUp APIs. The content is published as Github page site - [http://doc.sumup.com](http://doc.sumup.com)

## Getting started

### Dependencies

The build dependencies are Nodejs, Ruby, jekyll and gulp

* install gems
  ```
  bundle install
  ```
* install node packages
  ```
  npm install
  ```
  
### Build Tasks

* To generate all the articles run
  ```
  gulp docs:docs
  ```
* To generates APIs documentation
  ```
  gulp docs:apis
  ```

### Preview the generated content locally

  ```
  gulp serve:dev
  ```

### Publish the generated content

  ```
  gulp deploy
  ```
