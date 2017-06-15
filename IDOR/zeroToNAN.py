import glob
import nibabel as nib
import numpy as np

for filename in glob.iglob('*/**/*.png'):
    print(filename)
    
    nii = nib.load(filename)
    matrix = nii.get_data()
    matrix[matrix==0] = np.nan
    nii = nib.Nifti1Image(matrix, nii.get_affine())
    nii.set_filename(filename)    
    nib.save(nii,nii.get_filename())



