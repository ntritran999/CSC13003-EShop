<h3 align='center'>UNIVERSITY OF SCIENCE, VNUHCM</h3>
<h3 align='center'>FACULTY OF INFORMATION TECHNOLOGY</h3>
<br>
<p align='center'><img src='./images/logo.png' width=50% height=50%></p>

<h3 align='center'>SOFTWARE TESTING</h3>
<h4 align='center'>HW02 – Domain Testing on EShop</h4>

<br>
<br>
<br>

# 1. Student Information & General Information

- Name: Trần Trí Nhân
- Student ID: 23127097

# 2. Domain testing

In this requirement, I applied to AI-first principle to design the set of test cases.

First, I uploaded the README.md of EShop that contains the functional specifications of the system. The AI can view it to understand the overall architecture and the detail of each requirements. This made it easier for me to tell the AI what functional requirement I wanted to perform Domain testing on. I also uploaded the Domain testing slides from course slides (S04_Domain Testing.pdf). This acts as a source of truth that the AI must follow in order to complete my requests.

For the first stage, I prompted the AI to read the functional requirement I wanted to do Domain testing for, for example, FR-01, and asked it to try to understand the requirements for each input field. Also in that same prompt, I told the AI to identify equivalence classes based on the guidelines mentioned in course slide about range of values, set of values and 'must be' scenarios. The AI then answered with equivalence classes and the rationale behind how it identified them. I then reviewed all of the classes and confirmed that the AI correctly followed both the guidelines of the course, and the functional requirements inside README file. 

For the second stage, the main test case design stage, I prompted the AI to the design the test cases based on the equivalence classes it identified from the first stage. I told it to followed the guidelines in the course slide to design these test cases. In order to avoid hallucinations, I explicitly pasted the guidelines from the slide directly into the prompt, that is the guidelines about designing test cases for valid classes and invalid classes, as well as the note to choose at least one test case from each class. I then carefully reviewed the test cases to ensure that they follow the guidelines mentioned in the course slides. Even though most the of the test cases were valid (I removed the redundant ones), all of them lack test objective and test step. I then manually added the test objective and test step to complete the test case designs.

I applied two stages above for all of the selected features in this homework. For the first feature, I explicitly stated what I wanted from the AI and how the AI should follow the specifications and the guidelines. For the rest of the features, since I was in the same conversation, in order to avoid redundant and long prompts, I just asked the AI to repeat the stages, or the steps, for the current feature. That being said, I still kept the stages separate (asked to repeat stage 1 then waited the AI to finished before asking to repeat stage 2) to avoid overloading the AI.

The below are the completes sets of test cases for each feature that I selected for this homework and their results:

- Pool A: FR-01: Đăng ký tài khoản



- Pool B: FR-07: Giỏ hàng (Shopping Cart)



- Pool C: FR-12: Kiểm soát truy cập (Access Control)



- Pool D: Mobile: Đăng ký tài khoản



# 3. Boundary Value Analysis

For this requirement, I treated it as stage 3 after finishing with equivalence classes identification and test cases design in stage 1 and stage 2 in Domain testing section.

I requested the AI to apply Boundary Value Analysis, following the guidelines in the course slides, to add BVA test cases for the features. Like with Domain Testing prompt stages, I only explicitly stated what I wanted for the first feature. As for the rest of the features, I simply asked the AI to repeat the stage rather instructing it how to do the BVA test cases design.

After the AI gave the BVA test cases, I reviewed all of them carefully to spot mistakes and missing fields. Although the BVA test suites were valid, all of them missed the test objective and test step, so I added them manually after the initial generation.

The below are the completes sets of BVA test cases for each feature that I selected for this homework:

- Pool A: FR-01: Đăng ký tài khoản


- Pool B: FR-07: Giỏ hàng (Shopping Cart)


- Pool C: FR-12: Kiểm soát truy cập (Access Control)


- Pool D: Mobile: Đăng ký tài khoản

# 4. AI gap analysis

# 5. Bug report

- Screenshots:

# 6. Agent skill