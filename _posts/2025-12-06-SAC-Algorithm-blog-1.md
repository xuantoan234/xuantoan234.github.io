---
title: 'SAC Algorithm'
date: 2025-12-06
permalink: /posts/2025/20251206/SAC-algorithm/
tags:
  - cool posts
  - category1
  - category2
# A Deep Dive into the Soft Actor–Critic (SAC) Algorithm
---
The **Soft Actor–Critic (SAC)** algorithm is one of the most influential advancements in modern reinforcement learning (RL), especially in continuous control tasks. Although its origins lie in machine learning, the algorithm is deeply rooted in *mathematics*—from stochastic calculus to optimization theory and information entropy. This blog will walk you through the mathematical foundations and inner mechanics of SAC in a structured, intuitive way. 

---

## 🔍 What Is SAC?

SAC is an **off-policy, model-free, actor–critic RL algorithm** that optimizes a stochastic policy in an environment with continuous actions. Its distinguishing feature is **entropy regularization**, which encourages exploration and yields more stable learning.

SAC blends three major elements:

1. **Maximum Entropy Reinforcement Learning**
2. **Actor–Critic Framework**
3. **Soft Q-Learning**


---

# Soft Actor–Critic (SAC) Algorithm — Detailed Mathematical Blog

## 📐 Mathematical Foundations

### 1. Maximum Entropy Objective

Standard RL maximizes the expected sum of rewards:

$$
J(\pi) = \sum_{t=0}^{\infty} \mathbb{E}_{\pi}\left[ r(s_t, a_t) \right]
$$

SAC uses the **maximum entropy objective**, enhancing exploration and improving robustness:

$$
J_{\text{max-ent}}(\pi) = 
\sum_{t=0}^{\infty} 
\mathbb{E}_{\pi} 
\left[
    r(s_t, a_t) 
    + 
    \alpha \mathcal{H}(\pi(\cdot \mid s_t))
\right]
$$

where:

* $$ \mathcal{H}(\pi(\cdot \mid s_t)) = -\mathbb{E}[ \log \pi(a_t \mid s_t) ] $$
* $$ \alpha $$ is the temperature parameter controlling the entropy–reward trade-off

This objective encourages **exploratory yet reward-driven** policies.

---

## 🧠 The Components of SAC

SAC maintains **three neural networks**:

1. **Two Q-functions**  
   $$ Q_{\theta_1}(s,a),\; Q_{\theta_2}(s,a) $$

2. **A stochastic actor (policy)**  
   $$ \pi_\phi(a \mid s) $$

Using two Q-networks reduces overestimation bias.

---

## 🔢 1. The Soft Q-Function Loss

The target for Q-learning includes the entropy term:

$$
y = 
r(s_t, a_t) 
+ \gamma 
\mathbb{E}_{a_{t+1} \sim \pi}
\left[
    \min_{i=1,2} Q_{\theta_i}(s_{t+1}, a_{t+1})
    - 
    \alpha \log \pi(a_{t+1} \mid s_{t+1})
\right]
$$

The loss for each Q-function is:

$$
J_Q(\theta_i) 
= 
\mathbb{E}
\left[
    (Q_{\theta_i}(s_t,a_t) - y)^2
\right]
$$

---

## 🔢 2. The Policy (Actor) Loss

The actor improves by minimizing:

$$
J_\pi(\phi)
=
\mathbb{E}_{s_t \sim \mathcal{D}}
\Bigg[
    \mathbb{E}_{a_t \sim \pi_\phi}
    \left[
        \alpha \log \pi_\phi(a_t \mid s_t)
        -
        \min_{i=1,2}
        Q_{\theta_i}(s_t, a_t)
    \right]
    \Bigg]
$$

This trades off:

* better Q-values  
* higher entropy (diverse actions)

---

## 🔥 Entropy Temperature Adjustment (Optional)

SAC can automatically adjust $$ \alpha $$ by minimizing:

$$
J(\alpha)
=
\mathbb{E}_{a_t \sim \pi}
\left[
    -\alpha
    \left(
        \log \pi(a_t \mid s_t)
        + 
        \mathcal{H}_{\text{target}}
    \right)
\right]
$$

This ensures the entropy stays close to a chosen target.


---

## 🏗️ Algorithm Outline

1. Initialize Q-networks, policy network, and target Q-networks
2. For each interaction step:

   * Sample action from the stochastic policy
   * Store transition in replay buffer
3. For each gradient step:

   * Update Q-networks using soft Bellman backup
   * Update policy via entropy-regularized objective
   * Update temperature ( \alpha ) if enabled
   * Soft-update target networks

---

## 📊 Why SAC Works So Well

### ✔ Stability

Entropy regularization smooths updates and prevents premature convergence.

### ✔ Robust Exploration

Stochasticity gives better performance in sparse or noisy reward tasks.

### ✔ Sample Efficiency

As an off-policy method, SAC reuses past experience effectively.

### ✔ Continuous Action Suitability

Perfect for robotics, control engineering, and physics-based environments.

---

## 🧮 SAC vs. Other RL Algorithms

| Algorithm | On/Off-Policy  | Deterministic? | Key Strength                             |
| --------- | -------------- | -------------- | ---------------------------------------- |
| DDPG      | Off-policy     | Deterministic  | Fast but less stable                     |
| TD3       | Off-policy     | Deterministic  | Reduced overestimation                   |
| PPO       | On-policy      | Stochastic     | Stable but less sample-efficient         |
| **SAC**   | **Off-policy** | **Stochastic** | **Exploration + stability + efficiency** |

---

## 🧾 Summary

The SAC algorithm is mathematically elegant and computationally effective. Its use of entropy regularization represents a shift toward more robust and exploratory learning strategies. With strong theoretical foundations and empirical results, SAC remains a state-of-the-art algorithm for continuous-control problems.

---

