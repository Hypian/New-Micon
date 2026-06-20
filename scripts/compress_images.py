import os
from PIL import Image

def compress_images(directory):
    max_width = 1000
    total_original_size = 0
    total_new_size = 0
    
    for filename in os.listdir(directory):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            filepath = os.path.join(directory, filename)
            original_size = os.path.getsize(filepath)
            total_original_size += original_size
            
            try:
                img = Image.open(filepath)
                
                # Convert to RGB if necessary (e.g., for PNG with alpha or RGBA)
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                    
                # Resize if wider than max_width
                if img.width > max_width:
                    ratio = max_width / float(img.width)
                    new_height = int((float(img.height) * float(ratio)))
                    img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                
                # Save as WebP
                new_filename = os.path.splitext(filename)[0] + '.webp'
                new_filepath = os.path.join(directory, new_filename)
                
                img.save(new_filepath, 'webp', quality=80, method=4)
                
                new_size = os.path.getsize(new_filepath)
                total_new_size += new_size
                print(f"Compressed {filename}: {original_size/1024:.1f}KB -> {new_size/1024:.1f}KB")
                
                # Close the image before deleting the original
                img.close()
                
                # Remove the original file
                os.remove(filepath)
            except Exception as e:
                print(f"Failed to compress {filename}: {e}")
                
    print(f"\nOptimization Complete!")
    print(f"Original Total Size: {total_original_size / (1024*1024):.2f} MB")
    print(f"New Total Size: {total_new_size / (1024*1024):.2f} MB")
    print(f"Saved: {(total_original_size - total_new_size) / (1024*1024):.2f} MB")

if __name__ == "__main__":
    compress_images("src/assets")
