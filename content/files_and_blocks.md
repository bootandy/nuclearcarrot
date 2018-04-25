+++
title = "Linux filesystems & Blocks"
date = 2018-04-25
+++

When making symlinks I always unthinkingly type 'ln -s existing_file new_file'. I never really thought about what the '-s' meant. It transpires that '-s' means 'soft', if it is omitted it creates a hard link which means the newfile has the same [Inode](http://www.linfo.org/inode.html) as the old file. If either file is edited the other one will be updated as well because the filesystem says they are the same file. (They both have the same unique identifier: (inode number))

Recently I learnt about block sizes and wow this was bizarre. Most modern systems (Linux / Mac) have a 4096 byte blocksize, which means the smallest file takes 4096 Bytes on disk even if it consists of a single character. Hence lots of tiny files result in unused spots in the filesystem.

However, block sizes are more confusing than that. The basic block size is 512 bytes so running 'du' on a tiny file will show you '8' because 8 * 512 = 4096. More confusing is that gdu shows '4' because gdu assumes a block size of 1024 as long as you didn't set the [POSIXLY_CORRECT](http://wiki.wlug.org.nz/POSIXLY_CORRECT) environment variable flag (If the flag was set then gdu would show 8 like du). *Head explodes*. On the plus side I fixed some issues with the [direct rust port of du](https://github.com/uutils/coreutils) while learning this.

Rust always returns [blocks as 512 bytes](https://doc.rust-lang.org/std/os/linux/fs/trait.MetadataExt.html#tymethod.st_blocks).

While testing [Dust](https://github.com/bootandy/dust) on linux I discovered a fascinating file called: [/proc/kcore](https://stackoverflow.com/questions/21170795/proc-kcore-file-is-huge). This is one hell of a confusing file to discover if you are writing a tool to calculated disk usage. To summarise /proc/kcore is a piece of black magic that as far as the processes are concerned looks like 128TB of virtual memory.

Earlier on I said that files use at least 4096 bytes even if they are small. However unix based file systems have another trick up their sleave to save disk space: [Sparse files](https://stackoverflow.com/questions/43126760/what-is-a-sparse-file-and-why-do-we-need-it). Files will not store the empty byte characters on disk, instead they store just enough information to rebuild the empty byte characters when required. This is why file sizes shown by 'du -h' (which count blocks and so ignore empty byte chars) look different to 'ls -l' (which is just file length. Note: gdu --apparent-size allows gdu to show file length instead of blocks.



