## JS Browser Network Transport Layer

Cloned from ```hrharder/Decent-Mint```, see that repo for the original code and Python versions. 

This repo contains two HTML documents as well as a set of scripts for interacting with Paradigm's BigchainDB event stream. 

The ```browser_broadcaster.html``` file contains a form that allows you to post transactions, and will return a TXID.

The ```browser_reader.html``` file listens to a BigchainDB websocket port and posts TXID's on the page as they come in, to demonstrate latency in order posting. 

