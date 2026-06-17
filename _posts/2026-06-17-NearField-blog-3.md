---
title: 'Near Field vs Far Field in 6G'
date: 2026-06-17
permalink: /posts/2026/20260617/Near-Field-in-6G/
tags:
  - cool posts
  - category1
  - category2
---
# Near-Field and Far-Field Wireless Communications

> **Lecture Notes for Massive MIMO, XL-MIMO, ISAC, and 6G Communications**

---

# 1. Introduction

Wireless communication systems have traditionally been designed under the **far-field assumption**, where electromagnetic waves are approximated as **plane waves**. This approximation has been extremely successful because conventional cellular base stations employ relatively small antenna arrays compared with the communication distance.

However, the emergence of **Massive MIMO**, **Extremely Large-Scale MIMO (XL-MIMO)**, **THz communications**, and **Integrated Sensing and Communications (ISAC)** has fundamentally changed this assumption.

Modern antenna arrays may contain hundreds or even thousands of antenna elements and can span several meters. Consequently, many users are no longer located in the far-field region but instead fall inside the **radiating near-field (Fresnel region)**.

As a result,

- the conventional plane-wave channel model becomes inaccurate,
- spherical-wave propagation must be considered,
- beam steering evolves into beam focusing,
- communication channels become dependent on both angle and distance.

Understanding these concepts is essential for modern 6G communication systems.

---

# 2. Electromagnetic Wave Propagation

An electromagnetic wave consists of two mutually perpendicular fields:

- Electric field (**E**)
- Magnetic field (**H**)

Both propagate in the direction

$$
\mathbf{k}
$$

such that

$$
\mathbf{E}
\perp
\mathbf{H}
\perp
\mathbf{k}.
$$

A monochromatic electromagnetic wave can be represented as

$$
E(\mathbf{r},t)
=
E_0
e^{j(\omega t-\mathbf{k}\cdot\mathbf{r})},
$$

where

- $E_0$ is the amplitude,
- $\omega=2\pi f$ is the angular frequency,
- $\mathbf{k}$ is the wave vector,
- $\mathbf{r}$ is the observation point.

The propagation speed is

$$
c=f\lambda,
$$

where

- $c$ is the speed of light,
- $f$ is the carrier frequency,
- $\lambda$ is the wavelength.

---

# 3. Plane Wave

## 3.1 Definition

A plane wave is an electromagnetic wave whose **wavefronts are planes**.

```
Wave propagation

|||||||||||||||||

|||||||||||||||||

|||||||||||||||||

↓

Propagation Direction
```

Every point located on the same wavefront has

- identical phase,
- identical amplitude.

The mathematical expression is

$$
E(\mathbf{r})
=
E_0
e^{-j\mathbf{k}\cdot\mathbf{r}}.
$$

Notice that only the phase changes with position.

---

## 3.2 Physical Interpretation

A plane wave does **not** imply that every antenna receives the signal with the same phase.

Instead, it means that

> the wavefront is locally flat.

Consider a uniform linear array (ULA).

```
Incoming wave

/////////////////////

o----o----o----o----o
```

The wavefront reaches the first antenna before the second one.

Therefore,

$$
\tau_1
<
\tau_2
<
\tau_3,
$$

where

$$
\tau
=
\frac{d}{c}
$$

is the propagation delay.

Since the received signal is

$$
s(t-\tau),
$$

the received phase becomes

$$
e^{-j2\pi f\tau}
=
e^{-j\frac{2\pi}{\lambda}d}.
$$

Hence,

> **The phase difference between antennas is simply the propagation delay expressed in radians.**

---

## 3.3 Why Is the Amplitude Nearly Constant?

Assume the user is located very far away.

```
                User

                  ●

///////////////////////////

o----o----o----o----o
```

The distances from the user to every antenna satisfy

$$
r_1
\approx
r_2
\approx
r_3.
$$

Since free-space attenuation is

$$
\frac1r,
$$

we obtain

$$
\frac1{r_1}
\approx
\frac1{r_2}
\approx
\frac1{r_3}.
$$

Therefore,

$$
|h_1|
\approx
|h_2|
\approx
\cdots
\approx
|h_M|.
$$

The only significant difference among antennas is the phase.

---

# 4. Spherical Wave

Unlike a plane wave, a spherical wave originates from a finite-distance source.

```
          Source

             ●

        ) ) ) ) )

     ) ) ) ) ) ) )

  ) ) ) ) ) ) ) ) )
```

The wavefront is no longer flat.

Instead,

- each antenna observes a different distance,
- each antenna receives a different amplitude,
- each antenna receives a different phase.

The received signal at antenna $m$ is

$$
h_m
=
\frac1{r_m}
e^{-j\frac{2\pi}{\lambda}r_m},
$$

where

$$
r_m
$$

is the exact distance between the source and antenna $m$.

---

# 5. Far-Field Communication

Under the far-field assumption,

$$
r_1
\approx
r_2
\approx
\cdots
\approx
r_M.
$$

Thus,

$$
|h_1|
=
|h_2|
=
\cdots
=
|h_M|.
$$

Only the propagation delay changes.

Consequently,

the steering vector becomes

$$
\mathbf a(\theta)
=
\begin{bmatrix}
1\\
e^{-jkd\sin\theta}\\
e^{-j2kd\sin\theta}\\
\vdots
\end{bmatrix},
$$

where

$$
k=\frac{2\pi}{\lambda}.
$$

Observe that

the phase progression is **linear**.

This property greatly simplifies

- channel estimation,
- beamforming,
- precoding.

---

# 6. Near-Field Communication

When the user moves closer to the antenna array,

```
           User

             ●

         ) ) ) )

      ) ) ) ) ) )

o----o----o----o
```

the distances satisfy

$$
r_1
\neq
r_2
\neq
r_3
\neq
r_4.
$$

The channel becomes

$$
h_m
=
\frac1{r_m}
e^{-j\frac{2\pi}{\lambda}r_m}.
$$

Notice that

- amplitude is different,
- phase is different,
- phase progression is nonlinear.

Consequently,

the steering vector depends on

$$
(r,\theta),
$$

instead of only

$$
\theta.
$$

---

# 7. Comparison Between Far Field and Near Field

| Property | Far Field | Near Field |
|------------|------------|------------|
| Wavefront | Plane | Spherical |
| Amplitude | Nearly constant | Different |
| Phase | Linear progression | Nonlinear progression |
| Channel depends on | Angle | Angle + Distance |
| Beamforming | Beam Steering | Beam Focusing |
| Steering Vector | $\mathbf a(\theta)$ | $\mathbf a(r,\theta)$ |

---

# Key Takeaways

- Plane waves arise when the transmitter is sufficiently far from the antenna array.
- A plane wave does **not** mean identical phase at every antenna.
- The phase difference represents the propagation delay between antennas.
- In the far field, only the phase changes significantly.
- In the near field, both amplitude and phase vary across the array.
- Near-field communication requires a new channel model based on spherical-wave propagation.

---

**Next Part:** Rayleigh Distance, Fresnel Region, Fraunhofer Region, Beam Steering vs. Beam Focusing, and why almost every XL-MIMO paper begins with the Rayleigh distance.
