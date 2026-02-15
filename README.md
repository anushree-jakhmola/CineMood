# CineMood – Intent-Based Movie Recommendation System

CineMood is an intelligent movie recommendation system designed to suggest films based on a user's **viewing intent and emotional experience**, rather than relying only on genres, ratings, or watch history.  
The objective of this project is to build a **real-world recommendation pipeline** that understands natural language mood descriptions and returns **relevant, high-quality movie suggestions** using Natural Language Processing and structured movie metadata.

---

## Motivation

Traditional recommendation systems depend on:

- User ratings  
- Viewing history  
- Generic genre filtering  

These approaches often fail to capture the **actual experience a user is seeking at a specific moment**.

CineMood aims to solve this limitation by:

- Understanding **free-text mood or intent**
- Mapping it to a **semantic viewing experience**
- Delivering **reliable and context-aware movie recommendations**

This creates a **more human-centric discovery system** for entertainment.

---

## Built With

The project is implemented using the following technologies:

- **Python** – Core programming language  
- **Natural Language Processing (NLP)** – Intent classification from user text  
- **PyTorch / Transformers** – Lightweight local inference model  
- **scikit-learn** – Supporting ML utilities  
- **Pandas & NumPy** – Data processing and analysis  
- **TMDb Dataset (1990-2025)** – Real-world movie metadata (~317K movies)  
- **HTML, CSS, JavaScript** – Frontend user interface  
- **Chart.js** – Visualization components  
- **FastAPI (planned)** – Production API layer  

---

## Getting Started

These instructions help you set up the project locally for development and testing.

### Prerequisites

- Install **Python 3.9+**
- Install required Python libraries from `requirements.txt`

---

### Clone the Repository

```bash
git clone https://github.com/<anushree-jakhmola>/CineMood.git
cd CineMood
```

---

### Create Virtual Environment (Optional)

```bash
pip install virtualenv
virtualenv venv
```

**Activate environment**

**Windows**
```bash
venv\Scripts\activate
```

**Linux / macOS**
```bash
source venv/bin/activate
```

---

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

### Run the Project

*(Final execution command will be added after model and API integration are completed.)*

---

## System Algorithm

The CineMood recommendation workflow follows these steps:

1. Accept **natural language mood/intent text** from the user.  
2. Process the text using a **trained NLP intent classification model**.  
3. Convert the prediction into a **structured intent label**  
   (e.g., comfort, action, emotional, horror, romance).  
4. Filter the **TMDb movie dataset** based on the predicted intent.  
5. Rank movies using **popularity and relevance signals**.  
6. Return **final recommendations** through the user interface.

---

## Dataset Description

- Source: **TMDb (The Movie Database)**  
- Coverage: **1990 – 2025**  
- Size: **~8,000 movies**  
- Fields used:
  - Title  
  - Overview  
  - Genres  
  - Popularity  
  - Release year  

The dataset is kept **raw and clean** to preserve real-world recommendation quality.

---

## Testing and Results

Initial evaluation of the intent model shows:

- Correct recognition of **action-oriented prompts**  
- Reliable detection of **emotional and comfort intents**  
- Fast **local inference without external APIs**

Further quantitative evaluation and UI-level testing are in progress.

---

## Project Status

### Completed

- Large-scale TMDb dataset collection  
- Data cleaning and structuring  
- Intent dataset generation strategy  
- Local NLP model prototype  
- Recommendation pipeline design  

### In Progress

- Final intent model training  
- Frontend–backend integration  
- API deployment layer  

### Future Scope

- User-adaptive recommendation learning  
- Explainable AI for recommendation reasoning  
- Full web deployment  
- Mobile-ready cinematic interface  

---

## References

### Research Areas

- Natural Language Processing for intent classification  
- Recommender system design  
- Human-centric content discovery  

### Data Source

- TMDb Movie Metadata  

---

## Author

**Anushree Jakhmola**

- AI/ML Developer focused on real-world intelligent systems  
- Building production-grade ML applications and recommendation engines  

---

## Acknowledgment

This project is developed as part of a continuous effort to design  
**practical, human-aware AI systems** that improve everyday digital experiences.
