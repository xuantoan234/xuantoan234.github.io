---
title: 'Near Field vs Far Field in 6G'
date: 2026-06-17
permalink: /posts/2026/20260617/Near-Field-in-6G-p2/
tags:
  - 6G
---
# Part II: Channel Models, Rayleigh Distance, Beam Steering, and Beam Focusing

---

# 8. Channel Models

The wireless channel describes how an electromagnetic wave propagates from the transmitter to the receiver.

The channel model depends on the propagation region.

- **Far-field:** Plane-wave propagation
- **Near-field:** Spherical-wave propagation

Therefore, different mathematical models are required.

---

# 8.1 Far-Field Channel Model

Assume a transmitter equipped with a Uniform Linear Array (ULA).

```
Incoming Plane Wave

/////////////////////////

o----o----o----o----o
```

Since the transmitter is sufficiently far away,

$$
r_1
\approx
r_2
\approx
\cdots
\approx
r_M.
$$

The attenuation is approximately identical for every antenna.

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

The only difference among antennas is the propagation delay.

The channel coefficient at antenna $m$ is

$$
h_m
=
\alpha
e^{-j\frac{2\pi}{\lambda}d_m},
$$

where

- $\alpha$ denotes the common attenuation,
- $d_m$ represents the additional propagation distance.

---

## Linear Phase Progression

Consider two adjacent antennas separated by distance

$$
d.
$$

```
          θ

///////////////////////

o----o----o----o
```

The additional propagation distance is

$$
\Delta l
=
d\sin\theta.
$$

Therefore,

the propagation delay is

$$
\Delta\tau
=
\frac{d\sin\theta}{c}.
$$

Consequently,

the phase shift becomes

$$
\Delta\phi
=
\frac{2\pi}{\lambda}
d\sin\theta.
$$

The steering vector is

$$
\mathbf a(\theta)
=
\begin{bmatrix}
1\\
e^{-jk d\sin\theta}\\
e^{-j2kd\sin\theta}\\
\vdots\\
e^{-j(M-1)kd\sin\theta}
\end{bmatrix},
$$

where

$$
k=\frac{2\pi}{\lambda}.
$$

Observe that

the phase increases linearly.

---

# 8.2 Near-Field Channel Model

Now consider a nearby user.

```
             User

               ●

           ) ) ) )

       ) ) ) ) ) )

o----o----o----o----o
```

The wavefront is no longer planar.

Each antenna observes a different propagation distance.

Hence,

$$
r_1
\neq
r_2
\neq
\cdots
\neq
r_M.
$$

The channel coefficient becomes

$$
h_m
=
\frac{\alpha}{r_m}
e^{-j\frac{2\pi}{\lambda}r_m}.
$$

Unlike the far-field model,

both

- amplitude
- phase

vary across antennas.

---

## Exact Distance

Assume the user is located at

$$
(r,\theta).
$$

The distance between the user and antenna $m$ is

$$
r_m
=
\sqrt{
r^2
+
(md)^2
-
2r(md)\sin\theta
}.
$$

Unlike the far-field approximation,

this expression cannot be simplified.

Therefore,

the phase progression is nonlinear.

---

# 9. Rayleigh Distance

Rayleigh distance is the boundary separating

- near field
- far field.

It determines whether the plane-wave approximation remains accurate.

---

## Why Is It Needed?

Suppose the antenna array has aperture

$$
D.
$$

```
|<--------- D --------->|

o-----------------------o
```

A user is located at distance

$$
R.
$$

```
              User

                ●

                |

                | R

                |

o-----------------------o
```

The center antenna and the edge antenna do not have exactly the same propagation distance.

---

## Path Difference

The center antenna observes

$$
R.
$$

The edge antenna observes

$$
\sqrt{
R^2+\left(\frac D2\right)^2
}.
$$

Therefore,

the maximum path difference is

$$
\Delta L
=
\sqrt{
R^2+\left(\frac D2\right)^2
}
-
R.
$$

When

$$
R
\gg
D,
$$

we apply the first-order Taylor expansion

$$
\sqrt{R^2+x}
\approx
R+\frac{x}{2R},
$$

which yields

$$
\Delta L
\approx
\frac{D^2}{8R}.
$$

---

## Phase Error

The corresponding phase error is

$$
\Delta\phi
=
\frac{2\pi}{\lambda}
\Delta L.
$$

If the phase error becomes too large,

the plane-wave approximation is no longer valid.

A commonly accepted criterion is

$$
\Delta L
<
\frac{\lambda}{16}.
$$

Substituting

$$
\Delta L
=
\frac{D^2}{8R},
$$

we obtain

$$
R
>
\frac{2D^2}{\lambda}.
$$

Thus,

the Rayleigh distance is

$$
\boxed{
R_{\rm Rayleigh}
=
\frac{2D^2}{\lambda}
}
$$

---

# Physical Interpretation

Rayleigh distance is **not a physical wall**.

Instead,

it is an engineering criterion indicating

> when the phase error introduced by the plane-wave approximation becomes sufficiently small.

---

# Influence of Array Size

Observe

$$
R
=
\frac{2D^2}{\lambda}.
$$

If the antenna aperture doubles,

$$
D
\rightarrow
2D,
$$

then

$$
R
\rightarrow
4R.
$$

Therefore,

larger arrays dramatically enlarge the near-field region.

---

# Influence of Frequency

Since

$$
\lambda
=
\frac{c}{f},
$$

higher frequencies produce

- smaller wavelength,
- larger Rayleigh distance.

Therefore,

THz communication naturally operates in the near field.

---

# Example

Suppose

- Frequency = 30 GHz
- Wavelength = 1 cm
- Aperture = 1 m

Then

$$
R
=
\frac{2(1)^2}{0.01}
=
200\ {\rm m}.
$$

Hence,

users within 200 meters are located inside the radiating near field.

---

# 10. Beam Steering

Far-field beamforming only changes

the propagation direction.

```
>>>>>>>>>>>>>>>>>>>>

Energy propagates
toward one direction.
```

The steering vector depends only on

$$
\theta.
$$

Therefore,

beamforming solves

an angular optimization problem.

---

# Beam Steering Equation

The beamforming vector is

$$
\mathbf w
=
\frac{\mathbf a(\theta)}
{\sqrt M}.
$$

The transmitted beam propagates toward

angle

$$
\theta.
$$

No distance information is involved.

---

# 11. Beam Focusing

Near-field communication fundamentally changes this behavior.

Instead of steering energy toward an angle,

the array concentrates energy at

a specific point.

```
               ●

          ))))))))

      ))))))))))))))

o----o----o----o----o
```

This phenomenon is known as

**Beam Focusing**.

---

## Why Does It Work?

Each antenna intentionally generates

a different phase

such that

all signals arrive

at exactly the same time

at the desired location.

Mathematically,

the phase compensation is

$$
w_m
=
e^{j\frac{2\pi}{\lambda}r_m}.
$$

Therefore,

the propagation phase

$$
e^{-j\frac{2\pi}{\lambda}r_m}
$$

is completely cancelled.

All antennas become phase-aligned

at the target position.

---

# Steering vs Focusing

Far Field

```
>>>>>>>>>>>>>>>>>>>>>>>
```

Near Field

```
            ●

        ))))))))

     )))))))))))))
```

One controls

the direction.

The other controls

the spatial position.

---

# Steering Vector Comparison

Far field

$$
\mathbf a(\theta).
$$

Near field

$$
\mathbf a(r,\theta).
$$

Therefore,

near-field beamforming requires estimating

both

- angle
- distance.

---

# Comparison

| Property | Far Field | Near Field |
|-----------|------------|------------|
| Wave Model | Plane Wave | Spherical Wave |
| Channel | Angle-dependent | Angle + Distance |
| Beamforming | Beam Steering | Beam Focusing |
| Steering Vector | $\mathbf a(\theta)$ | $\mathbf a(r,\theta)$ |
| Phase | Linear | Nonlinear |
| Amplitude | Nearly Constant | Varies Across Antennas |

---

# Key Takeaways

- The far-field assumption relies on the plane-wave approximation.
- Rayleigh distance defines the validity of this approximation.
- Large arrays significantly increase the near-field region.
- THz communication further enlarges the near-field region due to its small wavelength.
- Beam steering controls only the propagation direction.
- Beam focusing controls a specific point in space.
- Near-field channel models must jointly estimate angle and distance.
