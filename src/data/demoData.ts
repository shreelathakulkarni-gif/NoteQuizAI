import { DocumentData } from '../types';

export const SAMPLE_DOCUMENTS: DocumentData[] = [
  {
    id: 'doc-ai-foundations',
    title: 'Introduction to Artificial Intelligence & Neural Networks',
    fileName: 'AI_and_Neural_Networks_Chapter4.pdf',
    fileSize: 2457600, // ~2.4MB
    pageCount: 14,
    uploadedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: 'ready',
    topics: [
      'Machine Learning Paradigms',
      'Artificial Neural Networks',
      'Activation Functions',
      'Backpropagation & Gradient Descent',
      'Deep Learning Applications'
    ],
    summary: 'A comprehensive foundational overview of Artificial Intelligence, Machine Learning paradigms, multi-layer perceptron architecture, optimization functions, and modern deep neural networks with real-world computer vision and natural language applications.',
    extractedText: `CHAPTER 4: ARTIFICIAL INTELLIGENCE & DEEP LEARNING ARCHITECTURES

1. INTRODUCTION TO MACHINE LEARNING
Machine Learning (ML) is a subset of Artificial Intelligence that allows computer algorithms to automatically learn patterns and extract insights from historical data without being explicitly programmed with deterministic if-else rules.

Key Paradigms:
- Supervised Learning: Algorithms are trained on labeled datasets where both inputs and desired ground-truth outputs are provided. Examples include regression (predicting continuous house prices) and classification (diagnosing tumor benign/malignant).
- Unsupervised Learning: Algorithms explore unlabelled datasets to uncover latent clusters and patterns. Examples include k-means clustering for market segmentation and Principal Component Analysis (PCA) for dimensionality reduction.
- Reinforcement Learning: Agents learn optimal sequential decision policies by interacting with dynamic environments, receiving scalar reward or penalty signals (e.g., Markov Decision Processes, Q-learning).

2. ARTIFICIAL NEURAL NETWORKS (ANN)
An Artificial Neural Network is biologically inspired by the neural circuitry of the human cerebral cortex. An artificial neuron (Perceptron) computes a weighted linear combination of input signals, adds a scalar bias, and applies a non-linear activation function:
y = f(sum(w_i * x_i) + b)

Activation Functions:
- Sigmoid: Maps inputs to (0, 1). Useful for binary probability classification, but suffers from vanishing gradient problems at extreme saturation regions.
- ReLU (Rectified Linear Unit): Defined as f(x) = max(0, x). Highly computationally efficient and reduces vanishing gradients in deep feed-forward networks, though it can suffer from "Dying ReLU" when neurons output 0 permanently.
- Softmax: Normalizes a K-dimensional vector of real values into a probability distribution summing to 1.0, standard for multi-class classification.

3. OPTIMIZATION AND BACKPROPAGATION
Training deep neural networks requires minimizing a defined Loss Function (e.g., Mean Squared Error for regression, Categorical Cross-Entropy for multi-class classification).
- Gradient Descent: Iteratively calculates the gradient of the loss function with respect to every weight parameter and updates weights in the opposite direction:
theta = theta - alpha * grad(L)
where alpha is the learning rate.
- Backpropagation: Uses the mathematical Chain Rule of calculus to propagate the error backwards from the output layer through hidden layers to calculate partial derivatives efficiently.
- Modern Optimizers: Adam (Adaptive Moment Estimation), RMSprop, and SGD with Momentum dynamically adjust per-parameter learning rates to accelerate convergence and navigate saddle points.

4. MODERN DEEP LEARNING & TRANSFORMERS
Convolutional Neural Networks (CNNs) utilize spatial convolution filters for image classification and feature maps.
Transformers and Attention Mechanisms rely on self-attention equations to process sequential textual tokens in parallel, powering modern Large Language Models (LLMs).`,
    notes: {
      noteLength: 'medium',
      lastGeneratedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      overview: 'This study module covers fundamental machine learning paradigms, neural network components (weights, biases, activation functions), the backpropagation algorithm for training via gradient descent, and an introduction to modern architectures like CNNs and Transformers.',
      detailedNotes: [
        {
          id: 'sec-1',
          heading: '1. Machine Learning Foundations & Paradigms',
          subheading: 'Core classifications of learning paradigms based on supervision signals',
          bulletPoints: [
            'Machine Learning enables systems to learn predictive patterns from empirical data rather than rigid hardcoded logic.',
            'Supervised Learning requires pairs of (x, y) labeled training data. Primary tasks include Regression (continuous values) and Classification (discrete class categories).',
            'Unsupervised Learning discovers intrinsic structures in unlabeled data (x) using clustering (e.g., K-Means) and dimensionality reduction (e.g., PCA).',
            'Reinforcement Learning trains autonomous agents to maximize cumulative rewards through trial-and-error environmental interactions.'
          ],
          definitions: [
            {
              term: 'Supervised Learning',
              definition: 'Machine learning workflow where the model is provided with paired input features and corresponding ground-truth target labels during training.'
            },
            {
              term: 'Unsupervised Learning',
              definition: 'A machine learning approach where algorithms detect latent structures, groupings, or distributions in data without prior target labels.'
            }
          ],
          examples: [
            'Supervised: Spam email filtering (classification) and real estate pricing prediction (regression).',
            'Reinforcement: DeepMind AlphaGo and robotic arm locomotion algorithms.'
          ]
        },
        {
          id: 'sec-2',
          heading: '2. Artificial Neuron Architecture & Activation Functions',
          subheading: 'Mathematical formulation of the perceptron and non-linear mappings',
          bulletPoints: [
            'The Perceptron computes y = f(∑ w_i·x_i + b), where w are synaptic weights, b is the bias, and f is an activation function.',
            'Activation functions introduce non-linearity, enabling the network to approximate complex non-convex decision boundaries.',
            'Sigmoid maps inputs to (0, 1) but causes vanishing gradient problems in deep architectures.',
            'ReLU (Rectified Linear Unit) f(x) = max(0, x) is the industry standard for hidden layers due to computational efficiency and gradient propagation.'
          ],
          definitions: [
            {
              term: 'Activation Function',
              definition: 'A mathematical non-linear function applied to an artificial neuron output to introduce non-linear mapping capabilities into neural networks.'
            },
            {
              term: 'Rectified Linear Unit (ReLU)',
              definition: 'An activation function defined as f(x) = max(0, x) that mitigates vanishing gradients and accelerates training convergence.'
            }
          ],
          examples: [
            'Using Softmax on the final 10-class layer of an image classifier to output probabilities that sum to 100%.'
          ]
        },
        {
          id: 'sec-3',
          heading: '3. Loss Functions, Optimization & Backpropagation',
          subheading: 'Mathematical mechanics of weight updating and gradient descent',
          bulletPoints: [
            'Loss functions quantify the discrepancy between network predictions and actual ground truth labels.',
            'Gradient Descent adjusts weights using θ = θ - α·∇L(θ), stepping in the direction of steepest descent.',
            'The Learning Rate (α) dictates step magnitude; too large causes oscillation/divergence, too small results in slow convergence.',
            'Backpropagation applies the calculus Chain Rule backwards from output layer to input layer to compute partial derivatives ∂L/∂w.',
            'Adam optimizer combines Momentum (moving average of gradients) with RMSprop (adaptive scaling by squared gradients).'
          ],
          definitions: [
            {
              term: 'Backpropagation',
              definition: 'An algorithm for computing the gradient of the loss function with respect to each network weight using the multivariate chain rule.'
            },
            {
              term: 'Learning Rate (α)',
              definition: 'A hyperparameter controlling the size of the parameter updates made during each optimization iteration in gradient descent.'
            }
          ],
          examples: [
            'Using Categorical Cross-Entropy loss for multi-class classification and Mean Squared Error (MSE) for numerical regression.'
          ]
        }
      ],
      keyPoints: [
        'Supervised learning relies on labeled data, unsupervised discovers natural clusters, and reinforcement learning optimizes reward-based policies.',
        'Non-linear activation functions (ReLU, Sigmoid, Softmax) are essential for neural networks to approximate non-linear functions.',
        'Backpropagation uses the calculus chain rule to calculate gradients of the loss function across all hidden layers.',
        'Optimization algorithms like Adam dynamically tune learning rates per weight for faster, stable convergence.',
        'Convolutional Neural Networks (CNNs) excel at spatial image tasks, while Transformer self-attention powers modern Large Language Models.'
      ],
      importantTerms: [
        {
          id: 't-1',
          term: 'Machine Learning',
          definition: 'A subfield of AI enabling systems to learn patterns and build decision models directly from empirical data without hardcoded deterministic rules.',
          context: 'Core Paradigm'
        },
        {
          id: 't-2',
          term: 'Perceptron',
          definition: 'The fundamental mathematical building block of an artificial neural network, combining weighted inputs, a bias term, and an activation function.',
          context: 'Architecture'
        },
        {
          id: 't-3',
          term: 'Vanishing Gradient Problem',
          definition: 'A phenomenon during backpropagation where gradients diminish exponentially as they propagate backward through deep layers, stalling weight updates.',
          context: 'Training Dynamics'
        },
        {
          id: 't-4',
          term: 'Adam Optimizer',
          definition: 'An adaptive learning rate optimization algorithm combining the advantages of AdaGrad (frequent updates) and RMSProp (recent squared gradients).',
          context: 'Optimization'
        },
        {
          id: 't-5',
          term: 'Cross-Entropy Loss',
          definition: 'A loss metric measuring performance of classification models whose output is a probability value between 0 and 1.',
          context: 'Evaluation'
        }
      ]
    },
    quiz: [
      {
        id: 'q-1',
        question: 'Which machine learning paradigm uses labeled input-output pairs to train predictive models?',
        options: [
          'Unsupervised Learning',
          'Supervised Learning',
          'Reinforcement Learning',
          'Self-Organizing Maps'
        ],
        correctAnswerIndex: 1,
        explanation: 'Supervised learning requires ground-truth labels for each input sample (x, y) so the algorithm can learn the mapping function between inputs and targets.',
        topic: 'Machine Learning Paradigms',
        difficulty: 'easy'
      },
      {
        id: 'q-2',
        question: 'What is the primary formula for the Rectified Linear Unit (ReLU) activation function?',
        options: [
          'f(x) = 1 / (1 + e^(-x))',
          'f(x) = max(0, x)',
          'f(x) = tanh(x)',
          'f(x) = e^x / sum(e^x)'
        ],
        correctAnswerIndex: 1,
        explanation: 'ReLU is defined as f(x) = max(0, x), returning 0 for negative inputs and x for positive inputs. This simple thresholding prevents vanishing gradients for positive activations.',
        topic: 'Activation Functions',
        difficulty: 'easy'
      },
      {
        id: 'q-3',
        question: 'Which mathematical principle forms the backbone of the Backpropagation algorithm in neural networks?',
        options: [
          'Calculus Chain Rule',
          'Bayes Theorem',
          'L\'Hôpital\'s Rule',
          'Pythagorean Theorem'
        ],
        correctAnswerIndex: 0,
        explanation: 'Backpropagation recursively applies the chain rule of multivariate calculus to compute the partial derivative of the overall loss with respect to each individual weight parameter.',
        topic: 'Backpropagation & Gradient Descent',
        difficulty: 'medium'
      },
      {
        id: 'q-4',
        question: 'What is the primary drawback of using the Sigmoid activation function across very deep neural networks?',
        options: [
          'Exploding computational cost',
          'Vanishing gradient problem at saturation extremes',
          'Outputs cannot be interpreted as probabilities',
          'It is strictly non-differentiable'
        ],
        correctAnswerIndex: 1,
        explanation: 'For large positive or negative values, the derivative of the sigmoid function approaches zero. Multiplying these small derivatives across many hidden layers causes gradients to vanish.',
        topic: 'Activation Functions',
        difficulty: 'medium'
      },
      {
        id: 'q-5',
        question: 'In gradient descent optimization, what occurs if the learning rate parameter (alpha) is set excessively high?',
        options: [
          'Training converges in one iteration',
          'The model overshoots the minimum and may diverge or oscillate violently',
          'Weights will decay to zero immediately',
          'The loss function becomes convex'
        ],
        correctAnswerIndex: 1,
        explanation: 'An overly large learning rate causes huge steps that overshoot the optimal loss basin, preventing convergence and causing the loss to diverge exponentially.',
        topic: 'Backpropagation & Gradient Descent',
        difficulty: 'medium'
      },
      {
        id: 'q-6',
        question: 'Which activation function is most appropriate for the final output layer of a multi-class (K > 2) classification network?',
        options: [
          'ReLU',
          'Sigmoid',
          'Softmax',
          'Leaky ReLU'
        ],
        correctAnswerIndex: 2,
        explanation: 'Softmax exponentiates and normalizes raw output logits into a valid probability distribution where all class probabilities are between 0 and 1 and sum to 1.0.',
        topic: 'Activation Functions',
        difficulty: 'easy'
      },
      {
        id: 'q-7',
        question: 'Which of the following is an example of an Unsupervised Learning task?',
        options: [
          'K-Means clustering of customer purchase histories',
          'Linear regression to predict housing prices',
          'Image classification on ImageNet labeled dataset',
          'Training a self-driving car via scalar environmental rewards'
        ],
        correctAnswerIndex: 0,
        explanation: 'K-Means clustering operates on unlabelled data to detect natural groupings and clusters without target supervisor labels.',
        topic: 'Machine Learning Paradigms',
        difficulty: 'medium'
      },
      {
        id: 'q-8',
        question: 'How does the Adam optimizer improve upon standard Stochastic Gradient Descent (SGD)?',
        options: [
          'It replaces backpropagation with genetic algorithms',
          'It computes adaptive learning rates for each parameter using momentum and squared gradient averages',
          'It removes the need for a loss function',
          'It disables bias parameters'
        ],
        correctAnswerIndex: 1,
        explanation: 'Adam (Adaptive Moment Estimation) tracks both first moments (mean/momentum) and uncentered second moments (variance) of gradients to dynamically scale per-parameter step sizes.',
        topic: 'Backpropagation & Gradient Descent',
        difficulty: 'hard'
      },
      {
        id: 'q-9',
        question: 'What is the fundamental mechanism enabling modern Transformer models to process textual tokens in parallel?',
        options: [
          'Self-Attention Mechanism',
          'Recurrent Hidden States',
          'Convolutional Stride Pooling',
          'Markov Decision Chains'
        ],
        correctAnswerIndex: 0,
        explanation: 'The Self-Attention mechanism computes pairwise relevance weights across all tokens simultaneously (Query, Key, Value matrices), bypassing the sequential bottleneck of RNNs.',
        topic: 'Deep Learning Applications',
        difficulty: 'hard'
      },
      {
        id: 'q-10',
        question: 'What loss function is standardly paired with Softmax for multi-class classification neural networks?',
        options: [
          'Mean Squared Error (MSE)',
          'Categorical Cross-Entropy Loss',
          'Hinge Loss',
          'Mean Absolute Percentage Error'
        ],
        correctAnswerIndex: 1,
        explanation: 'Categorical Cross-Entropy measures the distance between the predicted probability distribution and the true one-hot encoded ground truth, providing clean gradient signals when paired with Softmax.',
        topic: 'Backpropagation & Gradient Descent',
        difficulty: 'medium'
      }
    ],
    flashcards: [
      {
        id: 'fc-1',
        front: 'What is Supervised Learning?',
        back: 'A machine learning paradigm where the algorithm trains on paired input features and target labels (x, y) to learn a predictive mapping function.',
        topic: 'Machine Learning Paradigms',
        isRevision: false,
        isKnown: true
      },
      {
        id: 'fc-2',
        front: 'What is the mathematical definition of ReLU?',
        back: 'f(x) = max(0, x). It outputs 0 for negative values and passes positive values unchanged, preventing vanishing gradient issues.',
        topic: 'Activation Functions',
        isRevision: false,
        isKnown: true
      },
      {
        id: 'fc-3',
        front: 'What is the Backpropagation algorithm?',
        back: 'The core training method that uses the calculus Chain Rule backwards from output to input to calculate partial derivatives (∂L/∂w) for weight updates.',
        topic: 'Backpropagation & Gradient Descent',
        isRevision: true,
        isKnown: false
      },
      {
        id: 'fc-4',
        front: 'Why is the Softmax function used in multi-class classification?',
        back: 'It exponentiates logits and normalizes them so all output values range between 0 and 1, and sum up to exactly 1.0 (probability distribution).',
        topic: 'Activation Functions',
        isRevision: false,
        isKnown: true
      },
      {
        id: 'fc-5',
        front: 'What is the Vanishing Gradient Problem?',
        back: 'A training defect where gradients become exponentially small as they propagate backward through many layers (e.g. in deep Sigmoid networks), stopping learning.',
        topic: 'Backpropagation & Gradient Descent',
        isRevision: true,
        isKnown: false
      },
      {
        id: 'fc-6',
        front: 'What is the purpose of the Learning Rate (α)?',
        back: 'A hyperparameter that scales the size of weight updates during gradient descent. If too high, the model diverges; if too low, training is painfully slow.',
        topic: 'Backpropagation & Gradient Descent',
        isRevision: false,
        isKnown: true
      },
      {
        id: 'fc-7',
        front: 'What differentiates Reinforcement Learning from Supervised Learning?',
        back: 'In RL, there are no static labeled examples; an agent takes actions in an environment to maximize cumulative scalar reward signals.',
        topic: 'Machine Learning Paradigms',
        isRevision: false,
        isKnown: false
      },
      {
        id: 'fc-8',
        front: 'What is the Adam Optimizer?',
        back: 'An adaptive learning rate optimization algorithm that computes individual adaptive learning rates for different parameters from estimates of first and second moments of gradients.',
        topic: 'Backpropagation & Gradient Descent',
        isRevision: true,
        isKnown: false
      },
      {
        id: 'fc-9',
        front: 'What is the Perceptron equation?',
        back: 'y = f(∑(w_i * x_i) + b), where w_i are weights, x_i are inputs, b is bias, and f is an activation function.',
        topic: 'Artificial Neural Networks',
        isRevision: false,
        isKnown: true
      },
      {
        id: 'fc-10',
        front: 'What is the primary advantage of Transformers over RNNs?',
        back: 'Transformers use Self-Attention to process all sequential tokens simultaneously in parallel, eliminating the sequential step bottleneck of RNNs.',
        topic: 'Deep Learning Applications',
        isRevision: false,
        isKnown: false
      }
    ],
    quizHistory: [
      {
        id: 'attempt-1',
        documentId: 'doc-ai-foundations',
        documentTitle: 'Introduction to Artificial Intelligence & Neural Networks',
        date: new Date(Date.now() - 1 * 86400000).toISOString(),
        score: 8,
        totalQuestions: 10,
        percentage: 80,
        difficulty: 'medium',
        topic: 'All Topics',
        answers: []
      }
    ]
  },
  {
    id: 'doc-cell-bio',
    title: 'Cellular Biology & DNA Replication Mechanics',
    fileName: 'Cellular_Biology_Module3.pdf',
    fileSize: 1843200,
    pageCount: 9,
    uploadedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    status: 'ready',
    topics: [
      'Cell Membrane Structure',
      'Mitochondrial ATP Synthesis',
      'DNA Replication Enzymes',
      'Protein Synthesis: Transcription & Translation'
    ],
    summary: 'Detailed biological notes covering the lipid bilayer fluid mosaic model, Krebs cycle, semi-conservative DNA replication involving helicase and DNA polymerase III, and messenger RNA translation at ribosomal complexes.',
    extractedText: `CELLULAR BIOLOGY & MOLECULAR GENETICS
Module 3: Organelles, Energy Synthesis & The Central Dogma

1. CELL MEMBRANE DYNAMICS
The cellular plasma membrane is characterized by the Fluid Mosaic Model (Singer & Nicolson, 1972). It consists of an amphipathic phospholipid bilayer with hydrophilic phosphate heads exposed to aqueous cytoplasm and extracellular fluid, and hydrophobic fatty acid tails sequestered internally.
Transport Mechanisms:
- Passive Transport: Simple diffusion and facilitated diffusion via channel proteins down concentration gradients (no ATP consumed).
- Active Transport: Pumping ions (e.g. Na+/K+ ATPase pump) against electrochemical gradients using direct hydrolysis of ATP.

2. CELLULAR RESPIRATION & MITOCHONDRIA
Cellular respiration produces Adenosine Triphosphate (ATP) via three stages:
- Glycolysis: In cytoplasm, 1 glucose molecule is converted into 2 pyruvate, generating net 2 ATP and 2 NADH.
- Citric Acid Cycle (Krebs Cycle): In mitochondrial matrix, acetyl-CoA oxidation generates 6 NADH, 2 FADH2, and 2 GTP/ATP.
- Oxidative Phosphorylation: Along inner mitochondrial cristae, the Electron Transport Chain (ETC) pumps H+ into intermembrane space; ATP Synthase harnesses the proton gradient to synthesize ~28-32 ATP.

3. DNA REPLICATION ENZYMOLOGY
DNA replication is semi-conservative (Meselson-Stahl experiment).
Key Enzymes:
- Helicase: Unwinds the double helix at the replication fork.
- Topoisomerase (Gyrase): Relieves torsional strain and supercoiling ahead of helicase.
- Primase: Synthesizes short RNA primers to provide a free 3'-OH group.
- DNA Polymerase III: Synthesizes new complementary DNA strands strictly in the 5' to 3' direction.
- DNA Ligase: Seals phosphodiester nicks between Okazaki fragments on the lagging strand.`,
    notes: {
      noteLength: 'medium',
      lastGeneratedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      overview: 'Summary of molecular cellular biology highlighting membrane dynamics, oxidative phosphorylation generating ATP, and high-fidelity enzymatic DNA replication.',
      detailedNotes: [
        {
          id: 'bio-sec-1',
          heading: '1. Fluid Mosaic Membrane Architecture',
          subheading: 'Phospholipid bilayer and selective permeability',
          bulletPoints: [
            'Phospholipids form amphipathic bilayers with hydrophilic heads and hydrophobic core tails.',
            'Integral proteins act as ion channels, translocators, and signal receptors.',
            'Active transport requires ATP hydrolysis to move solutes against concentration gradients (e.g. Na+/K+ pump).'
          ],
          definitions: [
            {
              term: 'Amphipathic',
              definition: 'Having both hydrophilic (polar) and hydrophobic (non-polar) regions within a single molecule.'
            }
          ]
        },
        {
          id: 'bio-sec-2',
          heading: '2. DNA Replication Enzymatic Cascade',
          subheading: 'Enzymes required for semi-conservative replication in 5\' to 3\' direction',
          bulletPoints: [
            'Helicase unwinds the double helix at the replication fork.',
            'Primase lays down short RNA primers providing free 3\'-OH groups needed by DNA Polymerase.',
            'DNA Polymerase III continuously synthesizes the leading strand and discontinuously produces Okazaki fragments on the lagging strand.',
            'DNA Ligase seals phosphodiester backbone gaps.'
          ],
          definitions: [
            {
              term: 'Semi-conservative Replication',
              definition: 'Mechanism of DNA replication where each daughter DNA molecule contains one original parent strand and one newly synthesized strand.'
            }
          ]
        }
      ],
      keyPoints: [
        'Plasma membranes are selectively permeable phospholipid bilayers with embedded proteins.',
        'Mitochondria generate the majority of cellular ATP via the Electron Transport Chain and ATP Synthase.',
        'DNA synthesis proceeds strictly in the 5\' to 3\' direction via DNA Polymerase III.',
        'Lagging strand synthesis produces Okazaki fragments that are joined by DNA Ligase.'
      ],
      importantTerms: [
        {
          id: 'bio-t1',
          term: 'Helicase',
          definition: 'Enzyme that breaks hydrogen bonds between nitrogenous base pairs to unwind the DNA double helix.',
          context: 'Replication'
        },
        {
          id: 'bio-t2',
          term: 'ATP Synthase',
          definition: 'A rotary enzyme machine that utilizes the proton motive force across the mitochondrial inner membrane to phosphorylate ADP into ATP.',
          context: 'Metabolism'
        }
      ]
    },
    quiz: [
      {
        id: 'bio-q1',
        question: 'Which enzyme is responsible for unwinding the parental DNA double helix at the replication fork?',
        options: ['DNA Ligase', 'Helicase', 'Topoisomerase', 'RNA Primase'],
        correctAnswerIndex: 1,
        explanation: 'Helicase breaks the hydrogen bonds holding base pairs together, opening the replication fork.',
        topic: 'DNA Replication Enzymes',
        difficulty: 'easy'
      },
      {
        id: 'bio-q2',
        question: 'In what chemical direction does DNA Polymerase III synthesize newly replicated DNA strands?',
        options: ['3\' to 5\' only', '5\' to 3\' only', 'Both 5\' to 3\' and 3\' to 5\'', 'From middle outwards'],
        correctAnswerIndex: 1,
        explanation: 'DNA Polymerase can only attach new deoxynucleotides to a free 3\'-OH group, hence elongation is strictly in the 5\' to 3\' direction.',
        topic: 'DNA Replication Enzymes',
        difficulty: 'medium'
      },
      {
        id: 'bio-q3',
        question: 'Where does oxidative phosphorylation take place within eukaryotic cells?',
        options: ['Inner mitochondrial cristae', 'Cellular cytoplasm', 'Nucleolus', 'Lysosome lumen'],
        correctAnswerIndex: 0,
        explanation: 'The protein complexes of the electron transport chain and ATP synthase are embedded within the inner mitochondrial membrane (cristae).',
        topic: 'Mitochondrial ATP Synthesis',
        difficulty: 'medium'
      },
      {
        id: 'bio-q4',
        question: 'What is the function of DNA Ligase during lagging strand replication?',
        options: [
          'Synthesizing RNA primers',
          'Joining Okazaki fragments by forming phosphodiester bonds',
          'Unwinding the double helix',
          'Proofreading mismatched bases'
        ],
        correctAnswerIndex: 1,
        explanation: 'DNA Ligase catalyzes covalent phosphodiester bond formation between adjacent Okazaki fragments on the lagging strand.',
        topic: 'DNA Replication Enzymes',
        difficulty: 'easy'
      },
      {
        id: 'bio-q5',
        question: 'The sodium-potassium pump (Na+/K+ ATPase) is an example of which transport mechanism?',
        options: ['Simple Diffusion', 'Facilitated Osmosis', 'Primary Active Transport', 'Passive Dialysis'],
        correctAnswerIndex: 2,
        explanation: 'It directly hydrolyzes ATP to move 3 Na+ ions out and 2 K+ ions into the cell against their respective concentration gradients.',
        topic: 'Cell Membrane Structure',
        difficulty: 'hard'
      }
    ],
    flashcards: [
      {
        id: 'bio-fc1',
        front: 'What is the primary role of Helicase?',
        back: 'To break hydrogen bonds between nucleotide base pairs and unwind the double helix at the replication fork.',
        topic: 'DNA Replication Enzymes',
        isRevision: false,
        isKnown: true
      },
      {
        id: 'bio-fc2',
        front: 'Why is DNA replication termed "semi-conservative"?',
        back: 'Because each newly formed double helix consists of one original conserved parental strand and one newly synthesized strand.',
        topic: 'DNA Replication Enzymes',
        isRevision: false,
        isKnown: true
      },
      {
        id: 'bio-fc3',
        front: 'What produces the proton motive force in mitochondria?',
        back: 'The Electron Transport Chain (ETC) pumping protons (H+) from the matrix into the intermembrane space as electrons flow through complexes I-IV.',
        topic: 'Mitochondrial ATP Synthesis',
        isRevision: true,
        isKnown: false
      }
    ],
    quizHistory: [
      {
        id: 'bio-att1',
        documentId: 'doc-cell-bio',
        documentTitle: 'Cellular Biology & DNA Replication Mechanics',
        date: new Date(Date.now() - 4 * 86400000).toISOString(),
        score: 5,
        totalQuestions: 5,
        percentage: 100,
        difficulty: 'medium',
        topic: 'All Topics',
        answers: []
      }
    ]
  }
];

export const INITIAL_USER = {
  id: 'user-student-1',
  name: 'Alex Rivera',
  email: 'alex.rivera@university.edu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  joinedDate: 'August 2026',
  bio: 'Computer Science & Biomedical Engineering undergraduate. Passionate about AI study tools and deep learning.',
  institution: 'State University of Technology'
};
