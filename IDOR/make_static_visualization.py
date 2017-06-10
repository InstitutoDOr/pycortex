
import cortex
import cortex.dataset as dts


subject = 'PRJ1210_SUBJ003'
my_min = 0.15
my_max = 0.4
cm='afmhot_inksel'

ds = dts.Dataset()

dv1 = cortex.Volume('/home/brain/pycortex/IDOR/SUBJ003_train_corr.nii.gz', subject, 'fullhead', description='CORR',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/user/Desktop/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(CORR=dv1)


feature_names = ['ZCR', 'CENTROID', 'BRIGHTNESS', 'SPREAD', 'ROLLOFF', 'ENTROPY', 'FLATNESS', 'ROUGHNESS', 'RMS', 'SUB_BAND_FLUX_01', 'SUB_BAND_FLUX_02', 'SUB_BAND_FLUX_03', 'SUB_BAND_FLUX_04', 'SUB_BAND_FLUX_05', 'SUB_BAND_FLUX_06', 'SUB_BAND_FLUX_07', 'SUB_BAND_FLUX_08', 'SUB_BAND_FLUX_09', 'SUB_BAND_FLUX_10', 'PULSE_CLARITY', 'KEY_CLARITY'];

for idx, fn in enumerate(feature_names):
    iidx = format(idx+1, '04d')
    dv01 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_'+iidx+'.nii.gz', subject, 'fullhead', description='FEATURE',  cmap='RdBu_r', vmin=-0.5, vmax=0.5)
    kwargs = {fn: dv01}

    ds.append(**kwargs)

import cortex.webgl.view_adapted
# cortex.webgl.view_adapted.show_adapted(ds)

cortex.webgl.view_adapted.make_static('out_html' , ds)
#cortex.quickshow(ds)



