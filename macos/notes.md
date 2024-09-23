# System cleanup
System Settings > Storage - disk usage info

There is very big gray aread which often may take 70Gb or more and there is
no straightforward way to clean it without harming System Data. Plus this
group joins together very different sources, I noticed that the biggest 
areas that impact System Data are:

- Cache: /Library/Caches and ~/Library/Caches
  simply deleted these but there is utility to delete system backups
```
  sudo tmutil listlocalsnapshots
```
So before deleting all caches it is better to delete all local snapshots

- Logs: /Library/Logs and ~/Library/Logs
  simply deleted these

- App data: /Library/Application Support and ~/Library/Application Support
In macos apps are not installed but simply copied into /Applications folder
and in the /Applications folder it is only the application itself, the data
which it needs to work is stored in /Library/Application Support or
~/Library/Application Support. This is the biggest source of System Data.
