import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@/app/context/RouterContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { StatusBadge } from '@/app/components/ui/status-badge';
import { ArrowLeft, FileText, Download, Check, Info, FileSpreadsheet, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { mockProposals, mockTenders } from '@/app/data/mockData';
import { toast } from 'sonner';
import { useTranslation } from '@/app/context/LanguageContext';

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export default function AdminItemDetail() {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  const proposal = mockProposals.find(p => p.id === proposalId) || mockProposals[0];
  const tender = mockTenders.find(r => r.id === proposal.tenderId) || mockTenders[0];

  const [items, setItems] = useState([
    {
      id: 1,
      description: proposal.id === 'PROP-104' ? 'EV Charging Station Installations' : 'Core Services & Implementation',
      price: proposal.commercialAmount * 0.7,
      qty: 1,
      amount: proposal.commercialAmount * 0.7,
      receivedQty: proposal.id === 'PROP-104' ? 1 : 0
    },
    {
      id: 2,
      description: proposal.id === 'PROP-104' ? 'Fast-Charging Units' : 'Hardware Equipment',
      price: proposal.commercialAmount * 0.3 / (proposal.id === 'PROP-104' ? 20 : 10),
      qty: proposal.id === 'PROP-104' ? 20 : 10,
      amount: proposal.commercialAmount * 0.3,
      receivedQty: proposal.id === 'PROP-104' ? 20 : 5
    }
  ]);

  useEffect(() => {
    setItems([
      {
        id: 1,
        description: proposal.id === 'PROP-104' ? 'EV Charging Station Installations' : 'Core Services & Implementation',
        price: proposal.commercialAmount * 0.7,
        qty: 1,
        amount: proposal.commercialAmount * 0.7,
        receivedQty: proposal.id === 'PROP-104' ? 1 : 0
      },
      {
        id: 2,
        description: proposal.id === 'PROP-104' ? 'Fast-Charging Units' : 'Hardware Equipment',
        price: proposal.commercialAmount * 0.3 / (proposal.id === 'PROP-104' ? 20 : 10),
        qty: proposal.id === 'PROP-104' ? 20 : 10,
        amount: proposal.commercialAmount * 0.3,
        receivedQty: proposal.id === 'PROP-104' ? 20 : 5
      }
    ]);
  }, [proposal.id, proposal.commercialAmount]);

  const [remark, setRemark] = useState('');
  const [simulatorRemark, setSimulatorRemark] = useState('');
  const [simulatorRole, setSimulatorRole] = useState<'admin' | 'manager'>('admin');
  const [history, setHistory] = useState([
    {
      id: 1,
      date: '10/05/2026 14:30',
      receivedQty: proposal.id === 'PROP-104' ? 21 : 5,
      manager: 'Ahmed Al Mansoori',
      role: 'Logistics Officer',
      remarks: 'Initial batch received in good condition, verified against delivery note.'
    }
  ]);

  const handleSimulatorAction = (actionType: string) => {
    if (!simulatorRemark.trim()) {
      toast.error(t('Please enter a remark for the simulation.'));
      return;
    }
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleString(language === 'ar' ? 'ar-AE' : 'en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      receivedQty: items.reduce((sum, item) => sum + item.receivedQty, 0),
      manager: simulatorRole === 'admin' ? t('Prime Organization Admin (Simulator)') : t('Item Manager (Simulator)'),
      role: simulatorRole === 'admin' ? t('System Administrator') : t('Inventory Manager'),
      remarks: `[${t(actionType)}] ${simulatorRemark}`
    };
    setHistory([newEntry, ...history]);
    setSimulatorRemark('');
    toast.success(`${t(actionType)} ${t('logged successfully!')}`);
  };

  const handleReceivedQtyChange = (index: number, val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) return;
    
    const newItems = [...items];
    if (num >= 0 && num <= newItems[index].qty) {
      newItems[index].receivedQty = num;
      setItems(newItems);
    }
  };

  const handleUpdate = () => {
    if (!remark.trim()) {
      toast.error(t('Please enter a remark before updating.'));
      return;
    }
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleString(language === 'ar' ? 'ar-AE' : 'en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      receivedQty: items.reduce((sum, item) => sum + item.receivedQty, 0),
      manager: simulatorRole === 'admin' ? t('Prime Organization Admin (Simulator)') : t('Item Manager (Simulator)'),
      role: simulatorRole === 'admin' ? t('System Administrator') : t('Inventory Manager'),
      remarks: `[${t('Standard Update')}] ${remark}`
    };
    setHistory([newEntry, ...history]);
    setRemark('');
    toast.success(t('Item details updated successfully!'));
  };

  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const totalReceivedQty = items.reduce((sum, item) => sum + item.receivedQty, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const remainingQty = totalQty - totalReceivedQty;
  const status = remainingQty > 0 ? 'Pending' : 'Completed';

  return (
    <div className="space-y-6 pb-20">
      {/* Header matching Vendor Management style */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/items')} className="rounded-full">
            <ArrowLeft className={`h-5 w-5 ${language === 'ar' ? 'scale-x-[-1]' : ''}`} />
          </Button>
          <div>
            <h1 className="mb-2 text-3xl font-semibold" style={{ color: 'var(--prime-text-dark)' }}>
              {proposal.vendorName} - {proposal.vendorId}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-medium text-muted-foreground italic">
                {t('Managing Proposal')} {proposal.id} {t('for Tender')} {tender.id}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
        </div>
      </div>


      <div className="space-y-6">
        {/* Simulator Card */}
        <Card className="border-2 border-[var(--prime-primary-green)] shadow-md bg-[#F7F9FC]">
          <CardHeader className="pb-3 border-b border-gray-200 mb-4 bg-white rounded-t-xl flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2 text-[var(--prime-primary-green)]">
                <Info className="h-5 w-5" />
                {t('Role Simulator')}
              </CardTitle>
              <CardDescription className="text-sm font-medium mt-1">
                {t('Simulate receiving actions and updates.')}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={simulatorRole === 'admin' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSimulatorRole('admin')}
                style={simulatorRole === 'admin' ? { backgroundColor: 'var(--prime-primary-green)' } : {}}
                className={simulatorRole === 'admin' ? 'text-white font-bold shadow-sm' : 'font-semibold'}
              >
                {t('Admin Simulator')}
              </Button>
              <Button 
                variant={simulatorRole === 'manager' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSimulatorRole('manager')}
                style={simulatorRole === 'manager' ? { backgroundColor: 'var(--prime-primary-green)' } : {}}
                className={simulatorRole === 'manager' ? 'text-white font-bold shadow-sm' : 'font-semibold'}
              >
                {t('Item Manager')}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Combined Tender & Proposal Details */}
        <Card>
          <CardHeader className="pb-3 border-b border-gray-50 mb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="h-4 w-4 text-green-600" />
              {t('Tender & Proposal Details')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8">
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">{t('Tender ID')}</Label>
              <div className="text-sm font-semibold">{tender.id}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">{t('Tender Title')}</Label>
              <div className="text-sm font-semibold">{tender.title}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">{t('Tender Created Date')}</Label>
              <div className="text-sm font-semibold">{formatDate(tender.createdAt)}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">{t('Vendor Name')}</Label>
              <div className="text-sm font-semibold">{proposal.vendorName}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">{t('Proposal ID')}</Label>
              <div className="text-sm font-semibold">{proposal.id}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">{t('Proposal Deadline Date')}</Label>
              <div className="text-sm font-semibold">{formatDate(proposal.submissionDate)}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">{t('Approved Date')}</Label>
              <div className="text-sm font-semibold">{formatDate(proposal.approvedDate || new Date().toISOString())}</div>
            </div>
          </CardContent>
        </Card>

        {/* Item Details */}
        <Card>
          <CardHeader className="pb-3 border-b border-gray-50 mb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
              {t('Item Details')}
            </CardTitle>
            <CardDescription className="text-sm">{t('Track received quantities for the approved proposal items')}</CardDescription>
          </CardHeader>
          <CardContent className="p-0 px-6 pb-6">
            <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--prime-border-gray)' }}>
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-bold text-gray-700 py-3 text-start">{t('Description')}</TableHead>
                    <TableHead className="font-bold text-gray-700 text-end py-3">{t('Price (AED)')}</TableHead>
                    <TableHead className="font-bold text-gray-700 text-center py-3">{t('Qty')}</TableHead>
                    <TableHead className="font-bold text-gray-700 text-end py-3">{t('Amount (AED)')}</TableHead>
                    <TableHead className="font-bold text-[var(--prime-primary-green)] text-center w-32 py-3">{t('Received Qty')}</TableHead>
                    <TableHead className="font-bold text-gray-700 text-center w-32 py-3">{t('Remaining Qty')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={item.id} className="bg-white hover:bg-gray-50/50">
                      <TableCell className="font-medium text-gray-900 text-start">{item.description}</TableCell>
                      <TableCell className="text-end">{item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-center">{item.qty}</TableCell>
                      <TableCell className="text-end">{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-center p-2">
                        <Input 
                          type="number"
                          min={0}
                          max={item.qty}
                          value={item.receivedQty}
                          onChange={(e) => handleReceivedQtyChange(index, e.target.value)}
                          className="text-center border-[var(--prime-primary-green)] focus-visible:ring-[var(--prime-primary-green)] h-9 font-bold"
                        />
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        <span className={(item.qty - item.receivedQty) === 0 ? "text-green-600" : "text-amber-600"}>
                          {item.qty - item.receivedQty}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50 font-bold border-t-2" style={{ borderColor: 'var(--prime-border-gray)' }}>
                    <TableCell colSpan={2} className="text-end text-gray-900 py-3">{t('Grand Total')}</TableCell>
                    <TableCell className="text-center py-3">{totalQty}</TableCell>
                    <TableCell className="text-right py-3">{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-center py-3">{totalReceivedQty}</TableCell>
                    <TableCell className="text-center py-3">
                      <span className={remainingQty === 0 ? "text-green-600" : "text-amber-600"}>
                        {remainingQty}
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Documents & Remarks side by side or stacked based on screen */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Uploaded Documents */}
          <Card>
            <CardHeader className="pb-3 border-b border-gray-50 mb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-600" />
                {t('Uploaded Documents')}
              </CardTitle>
              <CardDescription className="text-sm">{t('Invoices, Delivery Notes, or Certificates')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50/50 transition-colors" style={{ borderColor: 'var(--prime-border-gray)' }}>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">Delivery_Note_001.pdf</div>
                      <div className="text-xs text-gray-500">{t('Uploaded 2 days ago')}</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 text-xs font-semibold">
                    <Download className={`me-2 h-3 w-3 ${language === 'ar' ? 'ms-2 me-0 scale-x-[-1]' : ''}`} /> {t('Download')}
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50/50 transition-colors" style={{ borderColor: 'var(--prime-border-gray)' }}>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">Tax_Invoice_055.pdf</div>
                      <div className="text-xs text-gray-500">{t('Uploaded yesterday')}</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 text-xs font-semibold">
                    <Download className={`me-2 h-3 w-3 ${language === 'ar' ? 'ms-2 me-0 scale-x-[-1]' : ''}`} /> {t('Download')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inline Administrative Action Card (Remarks) */}
          <Card className="border-2 border-gray-100 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-amber-500" />
                <CardTitle className="text-base font-bold">{t('Administrative Review')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="remarks" className="font-bold text-sm flex items-center justify-between">
                    {t('Remarks')}
                    <span className="text-[9px] text-red-500 font-black uppercase">{t('Required for update')}</span>
                  </Label>
                  <Textarea
                    id="remarks"
                    placeholder={t('Enter any observation regarding the received items...')}
                    className="min-h-[100px] resize-none"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-gray-50">
                  <Button 
                    className="gap-2 text-white h-10 px-6 font-bold shadow-md shadow-green-600/10 transition-all"
                    style={{ backgroundColor: 'var(--prime-success)' }}
                    onClick={handleUpdate}
                  >
                    <Check className="h-4 w-4" />
                    {t('Update')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Simulator Actions */}
        {simulatorRole === 'admin' && (
          <Card className="border-2 border-[var(--prime-primary-green)] shadow-md bg-[#F7F9FC]">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-[var(--prime-primary-green)]">
                <Info className="h-4 w-4" />
                <CardTitle className="text-base font-bold">{t('Admin Simulator Actions')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold text-sm">{t('Simulator Remark')}</Label>
                <Textarea 
                  placeholder={t('Enter a remark for this simulation...')}
                  className="bg-white border-gray-300 resize-none"
                  value={simulatorRemark}
                  onChange={(e) => setSimulatorRemark(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  className="text-white font-bold gap-2 shadow-md hover:shadow-lg transition-all"
                  style={{ backgroundColor: 'var(--prime-success)' }}
                  onClick={() => handleSimulatorAction('Goods Received')}
                >
                  <Check className="h-4 w-4" />
                  {t('Goods Received')}
                </Button>
                <Button 
                  variant="destructive" 
                  className="font-bold gap-2 shadow-md hover:shadow-lg transition-all bg-red-600 hover:bg-red-700"
                  onClick={() => handleSimulatorAction('Goods Not Received')}
                >
                  {t('Goods Not Received')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed History */}
        <Card className="border-2 border-gray-100 shadow-sm">
          <CardHeader className="pb-3 border-b border-gray-50 mb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Clock className="h-4 w-4 text-[var(--prime-primary-green)]" />
              {t('Detailed History')}
            </CardTitle>
            <CardDescription className="text-sm">{t('Audit trail of all receiving activities')}</CardDescription>
          </CardHeader>
          <CardContent className="p-0 px-6 pb-6">
            <div className="border rounded-lg overflow-hidden mt-2" style={{ borderColor: 'var(--prime-border-gray)' }}>
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-bold text-gray-700 py-3 text-start">{t('Date & Time')}</TableHead>
                    <TableHead className="font-bold text-gray-700 py-3 text-start">{t('Received Qty')}</TableHead>
                    <TableHead className="font-bold text-gray-700 py-3 text-start">{t('Item Manager')}</TableHead>
                    <TableHead className="font-bold text-gray-700 py-3 text-start">{t('Role')}</TableHead>
                    <TableHead className="font-bold text-gray-700 py-3 text-start">{t('Remarks')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((log) => (
                    <TableRow key={log.id} className="bg-white hover:bg-gray-50/50">
                      <TableCell className="font-medium text-gray-900 text-start">{log.date}</TableCell>
                      <TableCell className="font-bold text-[var(--prime-primary-green)] text-start">{log.receivedQty}</TableCell>
                      <TableCell className="text-gray-700 font-semibold text-start">{log.manager}</TableCell>
                      <TableCell className="text-gray-500 font-medium text-start">{log.role}</TableCell>
                      <TableCell className="text-gray-600 text-start">{log.remarks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
