import { exec } from 'child_process';
export const open = (url) => {
    exec(`open ${url}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`执行命令时出错: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
}