
import cortex
import cortex.dataset as dts


subject = 'template_colin'
my_min = -0.1
my_max = 0.1
cm='afmhot_inksel'

ds = dts.Dataset()

dv1 = cortex.Volume('/home/brain/pycortex/IDOR/rColinPC1mean6sub_mwW_mean_PCbest100voxels_Applied2All_mean.nii', subject, 'identity', description='PC1', vmin=my_min, vmax=my_max, cmap='RdBu_r')
ds.append(PC1=dv1)

'''
feature_names = ['ZCR', 'CENTROID', 'BRIGHTNESS', 'SPREAD', 'ROLLOFF', 'ENTROPY', 'FLATNESS', 'ROUGHNESS', 'RMS', 'SUB_BAND_FLUX_01', 'SUB_BAND_FLUX_02', 'SUB_BAND_FLUX_03', 'SUB_BAND_FLUX_04', 'SUB_BAND_FLUX_05', 'SUB_BAND_FLUX_06', 'SUB_BAND_FLUX_07', 'SUB_BAND_FLUX_08', 'SUB_BAND_FLUX_09', 'SUB_BAND_FLUX_10', 'PULSE_CLARITY', 'KEY_CLARITY'];

for idx, fn in enumerate(feature_names):
    iidx = format(idx+1, '04d')
    dv01 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_'+iidx+'.nii.gz', subject, 'fullhead', description='FEATURE',  cmap='RdBu_r', vmin=-0.5, vmax=0.5)
    kwargs = {fn: dv01}

    ds.append(**kwargs)
'''
import cortex.webgl.view_adapted
# cortex.webgl.view_adapted.show_adapted(ds)

cortex.webgl.view_adapted.make_static('meanPC1_100vx_colin_html' , ds)
#cortex.quickshow(ds)



