# Patchright Cluster

Create a cluster of patchright workers. This library spawns a pool of Chromium instances via [patchright] and helps to keep track of jobs and errors. This is helpful if you want to crawl multiple pages or run tests in parallel. patchright Cluster takes care of reusing Chromium and restarting the browser in case of errors.
