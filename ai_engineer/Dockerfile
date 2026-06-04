# Gunakan image resmi Python yang ringan
FROM python:3.10-slim

# Tentukan folder kerja di dalam container
WORKDIR /code

# Salin persyaratan dan pasang pustaka pendukung
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Salin seluruh kode aplikasi, model, dan database JSON
COPY . .

# Berikan hak akses penuh ke direktori kerja (Wajib untuk Hugging Face)
RUN chmod -R 777 /code

# Jalankan Uvicorn di port 7860 (Port standar Hugging Face)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]