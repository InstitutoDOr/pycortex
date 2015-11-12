import numpy as np
from nilearn.image import resample_img, smooth_img
import nibabel as nib
import cortex

TMP = nib.load('colin_91_109_91.nii')

my_min = 0
my_max = 1
#subject = 'fsaverage'
subject = 'S1'

path1 = 'ToM.nii'
dv1 = cortex.Volume(path1, subject, 'icbmtrans', cmap="RdBu_r", vmin=my_min, vmax=my_max, dfilter="trilinear")
cortex.webgl.make_static('LTPJ_TOM', dv1)

path2 = '/f/projekt_gesa/LTPJ_priors3/LTPJ_SMG_Language.nii'
dv2 = cortex.Volume(path2,subject, 'icbmtrans', cmap="RdBu_r", vmin=my_min, vmax=my_max, dfilter="trilinear")
cortex.webgl.make_static('LTPJ_SMG_Language', dv2)

path3 = '/f/projekt_gesa/LTPJ_priors3/_LTPJ_TARGET.nii'
dv3 = cortex.Volume(path3,subject, 'icbmtrans', cmap="RdBu_r", vmin=my_min, vmax=my_max, dfilter="trilinear")
cortex.webgl.make_static('LTPJ_TARGET', dv3)


path = '/git/nilearn/SCZ_TV-L1_weights_0.8.nii'
res_img = resample_img(nib.load(path),
    TMP.get_affine(),
    TMP.shape,
    interpolation='nearest')
data = res_img.get_data()
data = np.abs(data) * 10000
nib.Nifti1Image(data, res_img.get_affine()).to_filename('dump.nii')
#from scipy.stats import zscore
dv4 = cortex.Volume('dump.nii',subject, 'icbmtrans', cmap="RdBu_r", vmin=my_min, vmax=my_max, dfilter="trilinear")
cortex.webgl.make_static('scz', dv4)


from matplotlib import pyplot as plt
cortex.quickshow(dv1)




path = 'ToM.nii'
dv = cortex.Volume(path,'S1', 'icbmtrans', cmap="RdBu_r", vmin=my_min, vmax=my_max, dfilter="trilinear")
cortex.webshow(dv)

path = 'ToM.nii'
dv = cortex.Volume(path,'fsaverage', 'icbmtrans', cmap="RdBu_r", vmin=my_min, vmax=my_max, dfilter="trilinear")
cortex.webshow(dv)
