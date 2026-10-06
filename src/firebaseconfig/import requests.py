import requests
import os

def download_gradesheet(admission_no):
    url = "https://parent.iitism.ac.in/index.php/parent_portal/grade_sheet/print_grade_report/0/B.TECH"
    try:
        # Send a POST request with the admission number
        response = requests.post(url, data={"admn_no": admission_no})
        
        # Check if the request was successful
        if response.status_code != 200:
            print(f"Error: Failed to fetch grade sheet for {admission_no}. HTTP Status: {response.status_code}")
            return
        
        # Check the content type to ensure it's a PDF
        content_type = response.headers.get('Content-Type')
        if content_type != 'application/pdf':
            print(f"Unexpected content type: {content_type}. The server might be returning an error page.")
            # Print the first 500 characters of the response text for debugging
            print(response.text[:500])
            return
        
        # Ensure the download path is correct
        download_path = os.path.expanduser("~/Downloads")  # Adjust if needed
        if not os.path.exists(download_path):
            os.makedirs(download_path)
        
        # Save the PDF file
        pdf_path = os.path.join(download_path, f"Gradesheet_{admission_no}.pdf")
        if os.path.exists(pdf_path):
            print(f"Warning: File {pdf_path} already exists. It will be overwritten.")
        
        with open(pdf_path, "wb") as pdf_file:
            pdf_file.write(response.content)
        
        print(f"Gradesheet for {admission_no} saved at: {pdf_path}")
    
    except requests.RequestException as e:
        print(f"Network error while fetching grade sheet for {admission_no}: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

# Example usage
download_gradesheet("22JE562")
