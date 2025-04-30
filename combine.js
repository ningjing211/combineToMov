const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// 输入文件路径
const audioFile = process.argv[2];
const imageFile = process.argv[3];
const outputFile = process.argv[4];

if (!audioFile || !imageFile || !outputFile) {
    console.log('使用方法: node combine.js <音频文件> <图片文件> <输出文件>');
    process.exit(1);
}

// 处理文件路径中的空格
const escapePath = (filePath) => {
    return `"${filePath.replace(/"/g, '\\"')}"`;
};

// 记录开始时间
const startTime = new Date();
console.log(`开始时间: ${startTime.toLocaleString()}`);

// FFmpeg命令
const ffmpegCommand = `ffmpeg -loop 1 -i ${escapePath(imageFile)} -i ${escapePath(audioFile)} \
-c:v libx264 -preset veryslow -crf 15 \
-c:a aac -b:a 320k \
-pix_fmt yuv420p \
-movflags +faststart \
-vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
-shortest \
-threads 0 \
-progress pipe:1 \
${escapePath(outputFile)}`;

console.log('开始处理...');
console.log('这可能需要一些时间，请耐心等待...');

// 保存处理记录的函数
function saveProcessingRecord(audioFile, imageFile, outputFile, startTime, endTime, duration) {
    const logFile = 'processing_history.log';
    const record = {
        audioFile,
        imageFile,
        outputFile,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: duration,
        date: new Date().toLocaleDateString()
    };

    let history = [];
    try {
        if (fs.existsSync(logFile)) {
            const data = fs.readFileSync(logFile, 'utf8');
            history = JSON.parse(data);
        }
    } catch (err) {
        console.log('创建新的历史记录文件');
    }

    history.push(record);
    fs.writeFileSync(logFile, JSON.stringify(history, null, 2));
}

// 格式化持续时间
function formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;
    return `${hours}小时${remainingMinutes}分${remainingSeconds}秒`;
}

exec(ffmpegCommand, (error, stdout, stderr) => {
    const endTime = new Date();
    const processingTime = endTime - startTime;
    
    if (error) {
        console.error(`执行出错: ${error}`);
        console.error('FFmpeg错误输出:', stderr);
        return;
    }
    
    console.log('处理完成！');
    console.log(`结束时间: ${endTime.toLocaleString()}`);
    console.log(`总处理时长: ${formatDuration(processingTime)}`);
    
    // 保存处理记录
    saveProcessingRecord(
        audioFile,
        imageFile,
        outputFile,
        startTime,
        endTime,
        formatDuration(processingTime)
    );
    
    // 显示历史记录文件位置
    console.log('\n处理记录已保存到 processing_history.log');
}); 