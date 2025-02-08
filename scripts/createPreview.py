import subprocess
import os
import sys

def create_preview(glb_filename):
    # Get the absolute paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    glb_path = os.path.join(script_dir, f"../public/models/{glb_filename}")
    preview_dir = os.path.join(script_dir, "../public/previews")
    os.makedirs(preview_dir, exist_ok=True)
    
    # Create the preview filename
    preview_filename = os.path.splitext(glb_filename)[0].lower() + "_preview.png"
    output_path = os.path.join(preview_dir, preview_filename)
    
    # Create a temporary Blender Python script
    blender_script = """
import bpy
import os
import sys
import math

# Get command line arguments
argv = sys.argv
argv = argv[argv.index("--") + 1:]  # get all args after "--"
input_file, output_file = argv

# Clear existing objects
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Import GLB file
bpy.ops.import_scene.gltf(filepath=input_file)

# Create camera
bpy.ops.object.camera_add(location=(5, -5, 3))
camera = bpy.context.active_object
camera.rotation_euler = (math.radians(60), 0, math.radians(45))

# Make this the active camera
bpy.context.scene.camera = camera

# Select all objects except camera
bpy.ops.object.select_all(action='DESELECT')
for obj in bpy.context.scene.objects:
    if obj.type != 'CAMERA':
        obj.select_set(True)

# Set up main light
light_data = bpy.data.lights.new(name="light", type='SUN')
light_object = bpy.data.objects.new(name="light", object_data=light_data)
bpy.context.scene.collection.objects.link(light_object)
light_object.location = (5, 5, 5)
light_object.rotation_euler = (0.5, 0.5, 0.5)

# Add ambient light using area light
area = bpy.data.lights.new(name="area", type='AREA')
area.energy = 50  # Increase the energy to make it brighter
area_obj = bpy.data.objects.new(name="area", object_data=area)
bpy.context.scene.collection.objects.link(area_obj)
area_obj.location = (0, 0, 5)
area_obj.scale = (5, 5, 5)  # Make the area light bigger

# Render settings
bpy.context.scene.render.image_settings.file_format = 'PNG'
bpy.context.scene.render.filepath = output_file
bpy.context.scene.render.resolution_x = 400
bpy.context.scene.render.resolution_y = 400

# Enable cycles render engine for better quality
bpy.context.scene.render.engine = 'CYCLES'
bpy.context.scene.cycles.samples = 128

# Render
bpy.ops.render.render(write_still=True)
"""
    
    # Write the Blender script to a temporary file
    script_path = os.path.join(script_dir, "temp_blender_script.py")
    with open(script_path, "w") as f:
        f.write(blender_script)
    
    try:
        # Run Blender in background mode with our script
        subprocess.run([
            "blender",
            "--background",
            "--python", script_path,
            "--",
            glb_path,
            output_path
        ], check=True)
        
        print(f"Preview saved as {output_path}")
    except subprocess.CalledProcessError as e:
        print(f"Error creating preview for {glb_filename}: {str(e)}")
    finally:
        # Clean up temporary script
        if os.path.exists(script_path):
            os.remove(script_path)

def main():
    # Get all GLB files from the models directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(script_dir, "../public/models")
    
    for filename in os.listdir(models_dir):
        if filename.endswith(".glb"):
            print(f"Creating preview for {filename}")
            create_preview(filename)

if __name__ == "__main__":
    main()
