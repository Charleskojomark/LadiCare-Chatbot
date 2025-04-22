import os
from django.http import JsonResponse
from django.shortcuts import render
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import google.generativeai as genai

genai.configure(api_key=settings.GENAI_API_KEY)
gemini_model = genai.GenerativeModel('models/gemini-1.5-flash')

# Load prompt from file
PROMPT_FILE_PATH = os.path.join(settings.BASE_DIR, 'prompts', 'ladicare_prompt.txt')
with open(PROMPT_FILE_PATH, 'r', encoding='utf-8') as f:
    base_prompt = f.read()


# Chatbot homepage
def chatbot_home(request):
    return render(request, 'chat.html')

# Handle chatbot response with error handling
@csrf_exempt
def chatbot_response(request):
    if request.method == 'POST':
        # Get user input from POST request
        message = request.POST.get('message', '')

        # Generate the response using the Gemini model
        response = gemini_model.generate_content(f"{base_prompt}\n{message}")


        # Send the generated response back to the frontend
        return JsonResponse({'response': response.text})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

