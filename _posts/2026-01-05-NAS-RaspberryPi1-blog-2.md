---
title: 'NAS-RaspberryPi-1'
date: 2026-01-05
permalink: /posts/2025/20251206/NAS-RaspberryPi1/
tags:
  - cool posts
# A Deep Dive into the Soft Actor–Critic (SAC) Algorithm
---
---
My friend gave me a device called a Raspberry Pi 1. At first, I didn’t know what to do with it because it is quite outdated for most modern use cases. However, I realized that I could still utilize this device by turning it into a Network Attached Storage (NAS). That is why I decided to explore a suitable way to configure it as a local NAS for my home. In this post, I will share what I did and what I learned from this experience.

This post guide shows how to turn a Raspberry Pi into a lightweight Network Attached Storage (NAS) using Samba. It covers connecting external USB/HDD/SSD storage, configuring automatic mounting with UUIDs, setting correct permissions, and sharing files across Windows, macOS, and Linux systems. The tutorial is designed to be beginner-friendly, command-

# 🗄️ Turn Raspberry Pi 1 into a NAS using Samba (Step-by-Step)

> **Goal**
>
> * Use Raspberry Pi as a **home NAS**
> * Attach **external USB / HDD / SSD storage**
> * Share files via **Samba** (Windows / macOS / Linux)
> * Ensure disks **auto-mount on reboot**

---

## 0) Switch to root (optional but convenient)

```bash
sudo -i
```

👉 Enters root shell so you don’t need to type `sudo` for every command.  
(You can skip this and keep using `sudo` if you prefer.)

---

## 1) Update the system

```bash
apt update && apt upgrade -y
```

👉 Updates package lists and upgrades installed packages.  
(Always do this before installing new software.)

---

## 2) Install Samba and required tools

```bash
apt install samba blkid -y
```

👉  
- `samba` → file sharing service  
- `blkid` → used to get disk UUIDs (required for `/etc/fstab`)

---

## 3) Plug in USB / HDD / SSD and detect it

```bash
lsblk -o NAME,FSTYPE,SIZE,MOUNTPOINT
```

👉 Lists all storage devices.  
Note the partition name (example: `/dev/sda1`).

---

## 4) View partition details and UUID

```bash
blkid /dev/sda1
```

👉 Displays filesystem type and **UUID**.  
(UUID is safer than device names for auto-mount.)

---

## 5) (Optional) Format disk to ext4 ⚠️ ERASES ALL DATA

```bash
mkfs.ext4 /dev/sda1
```

👉 Formats the partition as **ext4** (recommended for Linux).  
⚠️ **All existing data will be deleted**.

---

## 6) Create mount points

```bash
mkdir -p /mnt/usb
mkdir -p /mnt/hdd
```

👉 Creates directories where external storage will be mounted.

---

## 7) Temporarily mount the disk (test)

```bash
mount /dev/sda1 /mnt/usb
```

👉 Tests whether the disk mounts correctly before enabling auto-mount.

### Verify

```bash
df -h | grep /mnt/usb
ls -l /mnt/usb
```

👉 Confirms the disk is mounted and accessible.

---

## 8) Copy UUID for `/etc/fstab`

```bash
blkid /dev/sda1
```

👉 Copy the value inside `UUID="..."`.

---

## 9) Configure auto-mount using `/etc/fstab`

```bash
nano /etc/fstab
```

### If the disk is **FAT32 / vfat** (cross-platform USB)

```text
UUID=ABCD-1234  /mnt/usb  vfat  defaults,uid=xt234,gid=xt234,umask=022,noatime  0  0
```

👉 `uid/gid` ensures user `xt234` can write to FAT32.

### If the disk is **ext4**

```text
UUID=EEEE-FFFF  /mnt/hdd  ext4  defaults,noatime  0  2
```

👉 ext4 keeps Linux permissions internally.

Save and exit: **Ctrl+O → Enter → Ctrl+X**

---

## 10) Apply and test fstab

```bash
mount -a
```

👉 Mounts all filesystems in `/etc/fstab`.  
(No output = no errors.)

```bash
df -h | egrep '/mnt/usb|/mnt/hdd'
```

👉 Confirms auto-mount works.

---

## 11) Fix permissions (important for Samba)

```bash
chown -R xt234:xt234 /mnt/usb
chown -R xt234:xt234 /mnt/hdd
chmod 755 /mnt/usb
chmod 755 /mnt/hdd
```

👉 Ensures Samba user owns the storage and can access it safely.

---

## 12) Create shared directories

```bash
mkdir -p /mnt/hdd/shared
chown -R xt234:xt234 /mnt/hdd/shared
```

👉 Organizes folders to be shared via Samba.

---

## 13) Create Samba user (maps to Linux user)

```bash
smbpasswd -a xt234
```

👉 Sets Samba password for user `xt234`.  
(User must already exist: `adduser xt234` if needed.)

---

## 14) Configure Samba shares

```bash
cp /etc/samba/smb.conf /etc/samba/smb.conf.bak
nano /etc/samba/smb.conf
```

### Add at the bottom:

```ini
[USB]
   path = /mnt/usb
   browseable = yes
   read only = no
   valid users = xt234
   create mask = 0644
   directory mask = 0755

[HDD]
   path = /mnt/hdd/shared
   browseable = yes
   read only = no
   valid users = xt234
   create mask = 0644
   directory mask = 0755
```

👉 Defines two Samba shares: USB and HDD.

---

## 15) Restart Samba and enable auto-start

```bash
systemctl restart smbd nmbd
systemctl enable smbd nmbd
systemctl status smbd --no-pager
```

👉 Applies config, enables Samba at boot, and checks service status.

---

## ✅ Result

- Raspberry Pi works as a **NAS**
- External storage auto-mounts on boot
- Files accessible from:
  - **Windows** → `\\raspi-ip\HDD`
  - **macOS/Linux** → `smb://raspi-ip/HDD`

---

## 🔧 Optional next steps

- Static IP
- Webmin management
- Samba recycle bin
- User quotas
- RAID (mdadm)

---
